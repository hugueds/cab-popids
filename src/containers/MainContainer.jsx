import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import Popid from '../components/Popid/Popid';
import NextPopid from '../components/NextPopid/NextPopid';
import Takt from '../components/Takt/Takt';
import './MainContainer.css';
import CheckedList from '../components/CheckedList/CheckedList';

import CONFIG from '../config';
import dummy from '../api/dummydata';

let testN = '123456';
export default class MainContainer extends Component {

    state = {
        popids: dummy().popids,
        checkedList: [],
        selected: "",
        next: "",
        takt: 0,
    }

    handleClick = (el, param) => {

        // Perguntar se quer confirmar o popid, caso sim, adicionar a Lista de concluidos
        const awns = window.confirm('Deseja adicionar popid à Lista?');
        if (awns) {
            // Verificar se popid ja está na lista                                    
            if (!this.state.checkedList.includes(param)) {
                const checkedList = [...this.state.checkedList, param];
                const popids = [...this.state.popids];
                const popid = popids.find((x) => x.value === param);
                popid.checked = true;

                window.localStorage.setItem('checkedList', JSON.stringify(checkedList));
                this.setState({ checkedList });
            } else {
                console.log('Popid já está na lista');
            }
        }
    }

    componentDidMount() {

        // Buscar popids salvos no localstorage
        const checkedList = JSON.parse(window.localStorage.getItem('checkedList'));

        if (checkedList && checkedList.length) {
            // Para cada item da checklist, pegar o popid e marcar como checked
            const popids = [...this.state.popids];
            const popidsValues = popids.map(x => x.value);
            checkedList.map((a, b) => {
                const index = popidsValues.indexOf(a);
                if (index > -1) {
                    popids[index].checked = true;
                }
            });

            this.setState({ checkedList });
        }


        // OFFLINE TEST
        // setInterval(() => {
        //     const popids = [...this.state.popids];
        //     const newPopid = {station: 'TEST', value: testN.toString()}
        //     testN++;
        //     popids.unshift(newPopid);
        //     popids.splice(-1);            
        //     this.setState({popids});
        // }, 5000);
        // this.initSocket();


    }

    initSocket = () => {
        const socket = socketIOClient(CONFIG.SOCKET_SERVER);

        socket.on('connect', function () {
            console.log(`%c Web Socket Connected`, 'color: cyan;');            
        });

        socket.on('disconnect', () => {
            console.error('Perda de conexão com o servidor');            
        });

        socket.on('server popids', (data) => {
            const popids = [];
            if (!data) {
                return;
            }
            for (let i = CONFIG.START_STATION; i <= CONFIG.START_STATION + CONFIG.MAX_STATIONS; i++) {
                const station = CONFIG.STATIONS[i - CONFIG.START_STATION];
                const popid = data[i].popid;
                if (data[i].popid === '') {
                    popids.push({
                        station,
                        value: '000000'
                    });
                } else {
                    const checked = this.state.checkedList.includes(data[i].popid)
                    console.log(checked);
                    popids.push({
                        station,
                        value: popid,
                        checked
                    });
                }
            }
            this.setState({ popids });
        });

        socket.on('server takt', (data) => {
            if (!data) return;
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
        const { popids, checkedList, takt, next } = this.state;
        const pops = popids.map((p, i) => {
            return <Popid key={'popid-' + i} popid={p} updatePopList={this.handleClick} />
        });


        return (
            <div className="main-container">
                <div className="takt-container">
                    <NextPopid next={next} />
                    <Takt takt={takt} />
                </div>
                <div className="pops-container"> {pops} </div>
                <div className="checkedList-container" >
                    <CheckedList popids={checkedList} />
                </div>

            </div>
        )
    }
}

