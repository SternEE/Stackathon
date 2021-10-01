import React from 'react'
import TableRow from './TableRow.js'

const Table = (props) => {
  return (
    <table id="pixeltable">
      <tbody>
        { props.grid.map((row, rowIdx) => <TableRow key={rowIdx} rowIdx={rowIdx} row={row} />) }
      </tbody>
    </table>
  )
}


export default Table;
