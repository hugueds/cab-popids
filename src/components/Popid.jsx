import React from 'react'

export default function Popid(props) {
  return (
    <React.Fragment>
        <div>
            {props.station}
        </div>
        <div>
            {props.popid}
        </div>
    </React.Fragment>
  )
}
