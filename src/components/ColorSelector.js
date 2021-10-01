import React from 'react'

const ColorSelector = (props) => {
  return (
    <select onChange={props.onChange} value={props.selectedColor}>
      { props.colors.map(color => (
        <option key={color} value={color}>{color}</option>
      ))}
    </select>
  )
}

export default ColorSelector;
