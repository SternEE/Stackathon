import { connect } from 'react-redux';
import { addRow, AVAILABLE_COLORS, pickColor, setPoint } from '../store'
import Table from './Table.js'
import ColorSelector from './ColorSelector.js'
import React, {useRef, useEffect} from 'react';
//import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
//at one point i was suppose to use facemesh but this no longer is supported
//import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import {drawMesh} from "./utilities"

function App (props) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  //position of canvas
  let canvasElement=document.getElementById('canvas')
  if (canvasElement){
  let canvasPos = canvasElement.getBoundingClientRect();
  console.log(canvasPos)
  }


  // load facemesh
  const runFacemesh = async () =>{
    const net = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
    newMain(net)
    //window.requestAnimationFrame((timestamp)=>{main(net)});
  };

  async function newMain(model){
    if(webcamRef.current !== null && webcamRef.current.video.readyState === 4 ){
        const video = webcamRef.current.video
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;
        //set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight
        //set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
    // Load the MediaPipe Facemesh package.

    // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain an
    // array of detected faces from the MediaPipe graph. If passing in a video
    // stream, a single prediction per frame will be returned.
    const predictions = await model.estimateFaces({
      input: video
    });
    if (predictions.length){
    const keypoints = predictions[0].scaledMesh;
    props.setPoint([keypoints[1][0],keypoints[1][1]])
    }
  }
  await new Promise(resolve => setTimeout(resolve, 100));
  newMain(model)
}
  async function main(model) {
    if(webcamRef.current !== null && webcamRef.current.video.readyState === 4 ){
      console.log(webcamRef.current.video)
        const video = webcamRef.current.video
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;
        //set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight
        //set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
    // Load the MediaPipe Facemesh package.

    // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain an
    // array of detected faces from the MediaPipe graph. If passing in a video
    // stream, a single prediction per frame will be returned.
    const predictions = await model.estimateFaces({
      input: video
    });
   /* predictions.forEach(prediction=>{
      console.log(prediction.scaledMesh)
    }
    )
    */
    if (predictions.length > 0) {
      const ctx = canvasRef.current.getContext("2d")
      const points = drawMesh(predictions, ctx)
      /*
      `predictions` is an array of objects describing each detected face, for example:

      [
        {
          faceInViewConfidence: 1, // The probability of a face being present.
          boundingBox: { // The bounding box surrounding the face.
            topLeft: [232.28, 145.26],
            bottomRight: [449.75, 308.36],
          },
          mesh: [ // The 3D coordinates of each facial landmark.
            [92.07, 119.49, -17.54],
            [91.97, 102.52, -30.54],
            ...
          ],
          scaledMesh: [ // The 3D coordinates of each facial landmark, normalized.
            [322.32, 297.58, -17.54],
            [322.18, 263.95, -30.54]
          ],
          annotations: { // Semantic groupings of the `scaledMesh` coordinates.
            silhouette: [
              [326.19, 124.72, -3.82],
              [351.06, 126.30, -3.00],
              ...
            ],
            ...
          }
        }
      ]
      */

      for (let i = 0; i < predictions.length; i++) {
        const keypoints = predictions[i].scaledMesh;
        const header = document.getElementById('webcam');
        const elementPosition = header.getBoundingClientRect()

        // Log facial keypoints.
        for (let i = 0; i < keypoints.length; i++) {
          const [x, y, z] = keypoints[i];
        }
        props.setPoint([keypoints[1][0],keypoints[1][1]])
      }
    }
  }
    window.requestAnimationFrame((timestamp)=>{main(model)});
  }
  useEffect(()=>runFacemesh(), [])
  return (
    <div id="pixelate">
      <p>Pixelate</p>
      <div>
        <button id='add-row' onClick={() => props.addRow()}>Add a row</button>
        <h1>{props.point}</h1>
        <ColorSelector colors={AVAILABLE_COLORS}
          selectedColor={props.selectedColor}
          onChange={event => props.pickColor(event.target.value)}
        />
      </div>
      <Table grid={props.grid} />
      <Webcam id="webcam" ref={webcamRef} style={
        {
        position:"fixed",
        alignSelf: "center",
        margin: "auto",
        textAlign: "center",
        zIndex: -1,
        top:0,
        width: 640,
        height: 480
        }
      }/>
      <canvas id='canvas' ref={canvasRef}
      style={
        {
          position:"fixed",
          alignSelf: "center",
          textAlign: "center",
          margin: "auto",
          zIndex: -1,
          top:0,
          width: 640,
          height: 480
          }
      } />
      <div style={{
      position:"absolute",
      top: props.point[1],
      marginRight: props.point[0],
      zIndex: 1,
      width: 20,
      height: 20,
      backgroundColor: 'red'
       } }></div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    grid: state.grid,
    selectedColor: state.selectedColor,
    point: state.point
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addRow: () => dispatch(addRow()),
    pickColor: (color) => dispatch(pickColor(color)),
    setPoint: (coordinates) => dispatch(setPoint(coordinates))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

