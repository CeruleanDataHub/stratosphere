import React from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

const DashboardContainer = styled.section`
  margin-left: 18em;
  display: grid;
  grid-template-columns: auto auto auto;
`;

const CardDash = styled.div`
  margin: 2em;
  border-radius: 0.5em;
  border: 2px dashed #ffffff;
`;

const Card = styled.div`
  margin: 1em;
  border-radius: 0.25em;
  border: 1px solid #000000;
  background-color: #ffffff;
  height: 20em;
`;

const apiUrl = process.env.API_URL;
// console.log("apiUrl", apiUrl)
export default class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = { iotDevices: [], status: [] };
  }
  componentDidMount() {
    this.getIotDevices();
    const socket = io('https://iot-platform-api-test.azurewebsites.net');

    socket.on('data', (data) => {
      console.log('HERE');
      if (data) {
        //this.setState({ sensorData: data.data });
        this.setState({
          status: {
            [data.id]: data.level,
          },
        });
        //console.log(data);
      }
    });
    setTimeout(() => {
      this.setState({ animate: true });
    }, 100);
    // this.getEdgeDevices();
  }

  getIotDevices = () => {
    Axios.get(apiUrl + '/api/devices')
      .then((res) => {
        this.setState({ iotDevices: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // getEdgeDevices = () => {
  //     Axios.get(apiUrl + "/api/edges")
  //         .then(res => {
  //             this.setState({edgeDevices: res.data})
  //         })
  //         .catch(err => {
  //             console.log(err)
  //         })
  //
  // }
  showDeviceNotification = (deviceId) => {
    console.log('in the dashboard ', this.state.status);
    console.log('deviceId', deviceId);
    this.props.setNotificationStatus(this.state.status[deviceId]);
  };
  render() {
    console.log(this.state.status);
    return (
      <DashboardContainer id="dashboard">
        <CardDash>
          <Card>
            <div>
              {this.state.iotDevices && (
                <div>
                  <div className="device-list-columns">
                    <span> Device Id</span>
                    <span>Edge Device Id</span>
                  </div>
                  <div>
                    {this.state.iotDevices.map((resource) => (
                      <div
                        className="device-list-item"
                        key={resource.id}
                        onClick={() => this.showDeviceNotification(resource.id)}
                      >
                        <Link to={`/devices/${resource.id}`}><span>{resource.id}</span></Link>
                        <span>{resource.edge_device_id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </CardDash>
        <CardDash>
          <Card>THIS IS A CARD</Card>
        </CardDash>
      </DashboardContainer>
    );
  }
}
