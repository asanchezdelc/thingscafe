import React from 'react';
import logo from './logo.svg';
import './App.css';
import MqttWS from './components/MqttWS';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from './components/Header'

class App extends React.Component {
  handleData(data) {
    console.log(data.msg.toString());
  }

  render() {
    return (
      <Container fluid="true">
        <Row>
          <Col><Header /></Col>
         </Row>
        <Row>
          {/* <Col xs={3} className="sidebar">Sidebar</Col> */}
          <Col xs={12}>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edited and rea what? <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
              <Button variant="primary">Learn More??</Button>
            </header>
            <MqttWS url="ws://localhost:3000" onMessage={this.handleData} />
          </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
