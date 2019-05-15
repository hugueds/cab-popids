import React from 'react';

const style = {
  root: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    border: '1px solid white',
    flex: '1 1 auto',
    background: 'white'
  }
}

export default function NextPopid(props) {
  return (
    <div className="nextPopid-wrapper" style={style.root}>
      <div>PRÓXIMO</div>
      <div>123456</div>
      {/* <div>{props.next}</div> */}
    </div>
  )
}
