import React from "react";
import "./App.css";
import axios from "axios";

const baseApiUrl = process.env.REACT_APP_BASEAPIURL;

export default class App extends React.Component {
    constructor() {
        super();
        this.state = { iotDevices: [], iotEdgeDevices: [], iotDevice: "", iotEdgeDevice: "", loading: false };
    }

    componentDidMount() {
        this.getIotDevices();
        this.getEdgeDevices();
    }

    getIotDevices = () => {
        this.setState({loading: true});
        axios.get(baseApiUrl + "/api/devices")
            .then(res => {
                console.log(res.data);
                this.setState({iotDevices: res.data})
            })
            .catch(err => {
                console.log(err)
            }).finally(()=>{
                this.setState({loading: false});
            });
    }

    getEdgeDevices = () => {
        this.setState({loading: true});
        axios.get(baseApiUrl + "/api/edges")
            .then(res => {
                this.setState({iotEdgeDevices: res.data})
            })
            .catch(err => {
                console.log(err)
            }).finally(()=>{
                this.setState({loading: false});
            });
    }

    addIotDevice = () => {
        axios.post(baseApiUrl + "/api/devices", {
            data: this.state.iotDevice
        })
        .then(res => {
            const obj = {id: this.state.iotDevice};
            this.setState({iotDevice: "", iotDevices: [...this.state.iotDevices, obj] });
        })
        .catch(err => {
            console.log(err)
        });
    }

    addIotEdgeDevice = () => {
        axios.post(baseApiUrl + "/api/edges", {
            data: this.state.iotEdgeDevice
        })
        .then(res => {
            const obj = {id: this.state.iotEdgeDevice};
            this.setState({iotEdgeDevice: "", iotEdgeDevices: [...this.state.iotEdgeDevices, obj] });
        })
        .catch(err => {
            console.log(err)
        });
    }

    removeIotDevice = (id) => {
        axios.delete(baseApiUrl + "/api/devices", {
            data: {id}
        })
        .then(res => {
            this.setState({iotDevices: this.state.iotDevices.filter(d => d.id !== id) });
        })
        .catch(err => {
            console.log(err)
        });
    }

    removeIotEdgeDevice = (id) => {
        axios.delete(baseApiUrl + "/api/edges", {
            data: {id}
        })
        .then(res => {
            this.setState({iotEdgeDevices: this.state.iotEdgeDevices.filter(d => d.id !== id) });
        })
        .catch(err => {
            console.log(err)
        });
    }

    clearParent = (id) => {
        axios.put(baseApiUrl + "/api/devices", {
            id
        })
        .then(res => {
            this.setState({iotDevices: this.state.iotDevices.map(d => d.id === id ? {...d, edge_device_id: null} : d) });
        })
        .catch(err => {
            console.log(err)
        });
    }

    inputChange = (ev) => {
        if(ev.key == "Enter") {
            if(ev.target.name === "iotDevice") {
                this.addIotDevice()
            } else if(ev.target.name === "iotEdgeDevice") {
                this.addIotEdgeDevice();
            }
            return;
        }
        this.setState({
            [ev.target.name]: ev.target.value
        });
    }

    render() {
        return (
            <div className="container">
                <div className="input-boxes">
                    <div className="iot_device">
                        <h2 className="title">IoT Device ID</h2>
                        <div className="input-box">
                            <input type="text" name="iotDevice" className="text-box" value={this.state.iotDevice} onChange={this.inputChange} onKeyPress={this.inputChange}/>
                            <button className="submit-btn" disabled={this.state.loading} onClick={() => this.addIotDevice()}>
                                submit
                            </button>
                            <button className="submit-btn" disabled={this.state.loading} onClick={() => this.getIotDevices()}>
                                refresh
                            </button>
                        </div>
                        <h3>List of IoT Devices</h3>
                        <div className="device-list">
                            {this.state.iotDevices && this.state.iotDevices.map(device => (
                                <div className="device-list-item" key={device.id}>
                                    <span>id: {device.id}</span>
                                    <span>
                                        edge_device_id: {device.edge_device_id}
                                    </span>
                                    <span className="clear-parent" onClick={ () => this.clearParent(device.id) }>C</span>
                                    <span className="delete" onClick={ () => this.removeIotDevice(device.id) }>X</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="edge_device">
                        <h2 className="title">IoT Edge Device ID</h2>
                        <div className="input-box">
                            <input type="text" name="iotEdgeDevice" className="text-box" value={this.state.iotEdgeDevice} onChange={this.inputChange} onKeyPress={this.inputChange}/>
                            <button className="submit-btn" disabled={this.state.loading} onClick={() => this.addIotEdgeDevice()}>
                                submit
                            </button>
                            <button className="submit-btn" disabled={this.state.loading} onClick={() => this.getEdgeDevices()}>
                                refresh
                            </button>
                        </div>
                        <h3>List of IoT Edge Devices</h3>
                        <div className="device-list">
                            {this.state.iotEdgeDevices && this.state.iotEdgeDevices.map(device => (
                                <div className="device-list-item" key={device.id}>
                                    <span>id: {device.id}</span>
                                    <span className="delete" onClick={ () => this.removeIotEdgeDevice(device.id) }>X</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                
            </div>
        );
    }
}
