import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

const STATIONS = [
    'FA 3.1.1', 'FA 3.1.2', 'FA 3.1.3', 'FA 3.2.1', 'FA 3.2.2',
    'FA 4.1', 'FA 4.2', 'FA 4.3', 'FA 4.4'
];
const START_STATION = 15;
const MAX_STATIONS = 10;

const endpoint = '10.33.22.184:8083';

export default class MainContainer extends Component {

    state = {
        popids: [],
        selected: "",
        next: ""
    }

    componentDidMount() {
        // inicia socket
        // atualiza popids baseado no socket
        const socket = socketIOClient(endpoint);

        socket.on('connect', function () {
            console.log(`%c Web Socket Connected`, 'color: cyan;');    
            // $("#error-box").hide();
        });
        
        socket.on('disconnect', function() {
            console.error('Perda de conexão com o servidor');
            var error = { status: -1, message: 'Failed to connect to WebSocket Server' };
            // $("#error-box").show();
            // $("#error-box").text(error.message);
        });    
        
        
        socket.on('server popids', function(data) {
            if (!data) {
                return;
            }
            for (let i = START_STATION; i <= MAX_STATIONS; i++) {
                if (data[i].popid === '') {
                    // $('#station-' + i).text('-----------');
                } else {
                    // $('#station-' + i).text(data[i].popid);
                    // $('#traction-station-' + i).text(data[i].traction);
                }
                if (data[i].ready) {
                    // $('#station-' + i).parent('.popid').parent('.station').addClass('station-ready');
                    // $('#station-' + i).removeClass('station-stopped');
                } else {            
                    // $('#station-' + i).parent('.popid').parent('.station').removeClass('station-ready');
                }
            }
        });
        
        socket.on('server takt', function(data)  {
        
            if (!data) return;
        
            var instances = ["FA0", "ML0", "ML1", "ML2"];
        
            instances.map(updateTaktTime);
        
            function updateTaktTime(i) {
                var tag = data['time_' + i];
                var id = '#takt-' + i.toLowerCase();
                // $(id).text(convertMsToTime(tag));
                if (tag < 0) {
                    // $(id).parent('.takt').addClass('takt-negative');
                } else {
                    // $(id).parent('.takt').removeClass('takt-negative');
                }
            }
        
            if (data) {
                // $('#andon-message').html(data.andonMessage.replace(/\\n/, ' '));
            }    
        
        });
        
        socket.on('plc-status', function(status) {
            if (!status) {
                console.error('Falha na conexão com o PLC');
                // $("#restart-button").show();
            return;
            }
            // $("#restart-button").hide();
        });      

    }

    

    render() {
        return (
            <div className="main-container">

            </div>
        )
    }
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