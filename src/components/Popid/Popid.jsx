import React from 'react';
import './Popid.css';

function getClass(station) {
    switch (station) {
        case 'FA 4.2': {
            return 'popid-consumed '
        }
        case 'FA 2.4': {
            return 'popid-buffer '
        }
        default:
            return 'null '

    }
}

function isChecked(checked) {
    if (checked)
        return 'popid-checked';
}

const Popid = (props) => {

    return (
        <React.Fragment>
            <div className={'popid-wrapper ' + getClass(props.popid.station) + isChecked(props.popid.checked)} >
                <div className={'popid-station'}> {props.popid.station} </div>
                <div className="popid-value"> {props.popid.value} </div>
                <div className={'popid-button '}>
                    <button
                        className={(props.popid.checked ? 'hidden' : 'none')}
                        onClick={(e) => props.updatePopList(e, props.popid.value)}>
                        <span role="img" aria-label="checked">✅</span>
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Popid;