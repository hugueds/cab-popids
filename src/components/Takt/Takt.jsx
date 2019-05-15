import React from 'react';

const style = {
    root: {
      display: 'flex',
      width: '100%',
      marginLeft: '10%',
      textAlign: 'center',
      justifyContent: 'center',
      border: '1px solid white',
      flex: '1 1 auto',
      background: 'white'
    }
  }


export default function Takt(props) {    
  return (
    <div className="takt-wrapper" style={style.root}>
      <div>00:00</div>      
      {/* <div>{props.takt}</div>       */}
    </div>
  )
}

function convertMsToTime(ms) {
    var negative = false;
    var takt;
    if (ms < 0) {
        negative = true;
        ms = ms * -1;
    }
    var hr = 0;
    var min = (ms / 1000 / 60) << 0;
    var sec = (ms / 1000) % 60;

    if (sec < 10)
        takt = min + ":0" + sec;
    else
        takt = min + ":" + sec;

    if (negative)
        takt = "-" + takt;

    return takt;
}