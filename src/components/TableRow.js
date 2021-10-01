import React from 'react'
import TableCell from './TableCell.js'

const TableRow = (props) => {
  return (
    <tr>
      {props.row.map((color, colIdx) => (
        <TableCell key={colIdx} rowIdx={props.rowIdx} colIdx={colIdx} color={color} />
      ))}
    </tr>
  )
}

export default TableRow;