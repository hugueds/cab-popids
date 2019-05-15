import React from 'react';
import './CheckedList.css';

function removePopid() {
  const popids = JSON.parse(window.localStorage.getItem('checkedList'));
}

export default function CheckedList(props) {
  
  return (
    <div className="checked-list-wrapper">      
     {
      props.popids.map((p,i) => {
        return <div className="checked-popid" key={i} > {p} </div>
      })
    }
    </div>
  )
}
