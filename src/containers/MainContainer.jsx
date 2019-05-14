import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import Popid from '../components/Popid/Popid';
import './MainContainer.css';
import CheckedList from '../components/CheckedList/CheckedList';

const STATIONS = [
    'FA 2.1', 'FA 2.2', 'FA 2.3', 'FA 2.4',
    'FA 3.1.1', 'FA 3.1.2', 'FA 3.1.3', 'FA 3.2.1', 'FA 3.2.2',
    'FA 4.1', 'FA 4.2', 'FA 4.3', 'FA 4.4'
];
const START_STATION = 15;
const MAX_STATIONS = 12;

const endpoint = 'http://10.33.22.184:8083';

export default class MainContainer extends Component {

    state = {
        popids: ['111111', '222222'],
        checkedList: [],
        selected: "",
        next: "",
    }

    handleClick = (el, param) => {
        // Perguntar se quer confirmar o popid, caso sim, adicionar a Lista de concluidos
        const awns = window.confirm('Deseja adicionar popid à Lista?');        
        if (awns) {
            // Verificar se popid ja está na lista                                    
            if (!this.state.checkedList.includes(param)){
                const checkedList = [...this.state.checkedList, param];
                this.setState({checkedList});
            } else {
                console.log('Popid já está na lista');
            }            
        }
    }

    componentDidMount() {
        // inicia socket
        // atualiza popids baseado no socket
        const socket = socketIOClient(endpoint);

        socket.on('connect', function () {
            console.log(`%c Web Socket Connected`, 'color: cyan;');
            // $("#error-box").hide();
        });

        socket.on('disconnect', () => {
            console.error('Perda de conexão com o servidor');
            var error = { status: -1, message: 'Failed to connect to WebSocket Server' };
            // $("#error-box").show();
            // $("#error-box").text(error.message);
        });


        socket.on('server popids', (data) => {
            const popids = [];
            if (!data) {
                return;
            }
            for (let i = START_STATION; i <= START_STATION + MAX_STATIONS; i++) {
                if (data[i].popid === '') {
                    // $('#station-' + i).text('-----------');
                } else {
                    const checked = this.state.checkedList.includes(data[i].popid)
                    console.log(checked);
                    popids.push({
                        station: STATIONS[i - START_STATION],
                        value: data[i].popid,
                        checked
                    });
                    // Verificar se o Popid está na lista de concluidos, caso sim, criar um
                    // atributo marked = true;
                }
                if (data[i].ready) {
                    // $('#station-' + i).parent('.popid').parent('.station').addClass('station-ready');
                    // $('#station-' + i).removeClass('station-stopped');
                } else {
                    // $('#station-' + i).parent('.popid').parent('.station').removeClass('station-ready');
                }
            }
            this.setState({ popids });
        });

        socket.on('server takt', (data) => {

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

        socket.on('plc-status', (status) => {
            if (!status) {
                console.error('Falha na conexão com o PLC');
                // $("#restart-button").show();
                return;
            }
            // $("#restart-button").hide();
        });

    }



    render() {
        const { popids, checkedList } = this.state;
        const pops = popids.map((p, i) => {
            return <Popid key={'popid-' + i} popid={p} updatePopList={this.handleClick} />
        });


        return (
            <div className="main-container">  
                <div className="pops-container"> {pops} </div>
                <div className="checkedList-container" >
                    <CheckedList popids={checkedList} />
                </div>                
                
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