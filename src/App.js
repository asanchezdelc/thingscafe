import React from 'react';
import logo from './logo.svg';
import './App.css';
import MqttWS from './components/MqttWS';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import {Row, Col, CardDeck, Spinner, Card, Jumbotron} from 'react-bootstrap';
import Header from './components/Header'
import { Line, Doughnut } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerThreeQuarters, faCarBattery, faSignal, faLightbulb, faDatabase } from '@fortawesome/free-solid-svg-icons'

const now = new Date();

const lineChartState = {
  labels: [`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`],
  datasets: [
    {
      label: 'Temperature Trend',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [0]
    }
  ]
};

const doughnutState = {
  labels: [
    'Temperature',
    'Humidity',
    'Moisture'
  ],
  datasets: [{
    data: [75, 125, 200],
    backgroundColor: [
    '#CCC',
    '#36A2EB',
    '#FFCE56'
    ],
    hoverBackgroundColor: [
    '#FF6384',
    '#36A2EB',
    '#FFCE56'
    ],
    borderColor: '#343a40'
  }]
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
      username: '',
      channels: [],
      messages: { topic: '', msg: '' }, 
      device: '',
      ws: null,
      lineChartState: lineChartState,
      lastCommand: 0
    };

    this.sendCommand = this.sendCommand.bind(this);
    this.handleData = this.handleData.bind(this);
    this.wsOpen = this.wsOpen.bind(this);    
  }

  parseSingleChannel(data) {
    if (data.indexOf(",") === -1) {
      return {
        type: 'analog',
        unit: '',
        value: data
      }
    }

    const parts = data.split(",");
    const keyValue = (parts[1]).split("=");

    return {
      type: parts[0],
      unit: keyValue[0],
      value: keyValue[1]
    }
  }

  parseTopic(topic) {
    const parts = topic.split("/");

    return {
      username: parts[1],
      deviceId: parts[3],
      channel: parts[5]
    }
  }

  handleData(data) {
    const topic = this.parseTopic(data.topic);

    let channels = this.state.channels;
    channels[topic.channel] = this.parseSingleChannel(data.msg.toString());

    let currLineState = this.state.lineChartState;

    /*
    if (topic.channel === '12') {
      let oldDataset = currLineState.datasets[0];
      let newDataset = { ...oldDataset };
      const currTime = new Date();
      const currHour = `${currTime.getHours()}:${currTime.getMinutes()}:${currTime.getSeconds()}`;
      currLineState.labels.push(currHour);
      newDataset.data.push(this.getChannelData(12).value);
      currLineState.datasets = [newDataset];
    }*/
    
    this.setState({ 
      isConnected: true,
      device: topic.deviceId,
      username: topic.username,
      channels: channels, 
      messages: {
        topic: data.topic,
        channel: topic.channel
      },
      // Line Chart State
      lineChartState: currLineState
    });


  }

  wsOpen(ws) {
    this.setState({ ws:  ws });
  }

  sendCommand() {
    console.log('sending...');
    const thingId = this.state.device;
    const user = this.state.username;
    const ledstate = this.state.lastCommand;
    if (ledstate) {
      this.setState({ lastCommand: 0 })
    } else {
      this.setState({ lastCommand: 1 })
    }
    this.state.ws.publish(`v1/${user}/things/${thingId}/cmd/1`, `kdkd,${this.state.lastCommand}`);

  }

  getChannelData(ch) {
    if (this.state.channels.length === 0 
      || this.state.channels[ch] == null) return { value: 0 };

    return this.state.channels[ch];
    
  }

  getTemperatureValue(ch) {
    if (this.state.channels.length === 0) return;



    return this.state.channels[ch].value;
  }

  render() {

    return (
      <div className="App">
      <Container fluid="true">
        <Row>
          <Col><Header /></Col>
        </Row>
        
        <Row>        
          <Col xs={12}>
            <CardDeck>
              <Card bg="dark" text="white" style={{ width: '18rem' }}>
                <Card.Header>Device {this.state.device}</Card.Header>
                <Card.Body>
                  { this.state.isConnected ? 
                      <Spinner  animation="grow" variant="success" /> : <Spinner  animation="border" variant="danger" /> }
                  <Card.Text>
                    <Button variant="info" onClick={ this.sendCommand }>
                      <FontAwesomeIcon icon={faLightbulb} />
                      <span className=""> Toggle LED</span>
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>


              <Card bg="dark" text="white" style={{ width: '18rem' }}>
                <Card.Body>
                  <h1 className="display-1">{ Math.round(this.getChannelData(10).value) }° C</h1>
                  <FontAwesomeIcon icon={faSignal} size="4x" />
                </Card.Body>
              </Card>
              
              <Card bg="dark" text="white" style={{ width: '18rem' }}>
                <Card.Header>
                  <FontAwesomeIcon icon={faCarBattery} /> Battery Level
                </Card.Header>
                <Card.Body>
                  <GaugeChart id="gauge-chart1" percent={ (this.getChannelData(12).value * 10)/100 } />
                </Card.Body>
              </Card>
              
            </CardDeck>
            
            
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
          <CardDeck>
              <Card bg="dark" text="white" style={{ width: '18rem' }}>
                <Card.Header>
                  <FontAwesomeIcon icon={faThermometerThreeQuarters} /> Temperature Readings
                </Card.Header>
                <Card.Body>
                  <Line data={this.state.lineChartState} />
                </Card.Body>
              </Card>
              <Card bg="dark" text="white" style={{ width: '18rem' }}>
                <Card.Header>
                  <FontAwesomeIcon icon={faDatabase} /> Readings Analysis
                </Card.Header>
                <Card.Body>
                  <Doughnut data={doughnutState} />
                </Card.Body>
              </Card>
            </CardDeck>
          </Col>
        </Row>
       
      </Container>
      <MqttWS url="ws://localhost:3000" onMessage={this.handleData} onOpen={ this.wsOpen } debug={true} />

      </div>
    );
  }
}

export default App;
