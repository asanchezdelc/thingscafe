import React from 'react';
import PropTypes from 'prop-types';
import mqtt from 'mqtt';

class MqttWS extends React.Component {

    constructor(props) {
      super(props)

      this.state = {
        ws: null,
        attempts: 1
      };

      this.setupWebsocket = this.setupWebsocket.bind(this)
      this.onPublish = this.onPublish.bind(this);
      
    }

    onPublish(topic, msg) {
      console.log(topic, msg)
    }

    initWebsocket() {
      this.setState((state) => 
        /*global mqtt b:writable*/
        /*eslint no-undef: "error"*/
        ({
          ws: state.ws || mqtt.connect(this.props.url),
          attempts: 1
        })
      , this.setupWebsocket);
    }

    logging(logline) {
      if (this.props.debug === true) {
          console.log(logline);
      }
    }

    generateInterval (k) {
        if(this.props.reconnectIntervalInMilliSeconds > 0) {
            return this.props.reconnectIntervalInMilliSeconds;
        }
        return Math.min(30, (Math.pow(2, k) - 1)) * 1000;
    }

    setupWebsocket() {
      let websocket = this.state.ws;
      let props = this.props;
      //websocket.subscribe("bus/+/events");
      websocket.subscribe("v1/+/things/+/data/#");
      websocket.on("message", function(topic, payload) {
          //alert([topic, payload].join(": "));
          //client.end();
          props.onMessage({ topic: topic, msg: payload});
      });
      
      websocket.on('connect', () => {
        this.logging('Websocket connected');
        if (typeof props.onOpen === 'function') props.onOpen(websocket);
      });
      /*
     
      this.shouldReconnect = this.props.reconnect;
      websocket.onclose = () => {
        this.logging('Websocket disconnected');
        if (typeof this.props.onClose === 'function') this.props.onClose();
        if (this.shouldReconnect) {
          let time = this.generateInterval(this.state.attempts);
          this.timeoutID = setTimeout(() => {
            this.setState({attempts: this.state.attempts+1});
            this.setState({ws: new WebSocket(this.props.url, this.props.protocol)});
            //this.setupWebsocket();
          }, time);
        }
      }*/
    }

    componentDidMount() {
      this.initWebsocket();
    }

    componentWillUnmount() {
      this.shouldReconnect = false;
      clearTimeout(this.timeoutID);
      let websocket = this.state.ws;
      websocket.close();
    }

    sendMessage(message){
      let websocket = this.state.ws;
      websocket.send(message);
    }

    render() {
      return (
        <div></div>
      );
    }
}

MqttWS.defaultProps = {
    debug: false,
    reconnect: true
};

MqttWS.propTypes = {
    url: PropTypes.string.isRequired,
    onMessage: PropTypes.func.isRequired,
    onPublish: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    debug: PropTypes.bool,
    reconnect: PropTypes.bool,
    protocol: PropTypes.string,
    reconnectIntervalInMilliSeconds : PropTypes.number
};

export default MqttWS;

//export default Websocket;