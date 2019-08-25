import React from 'react';
import PropTypes from 'prop-types';
import ScriptLoader from 'react-script-loader-hoc';

class MqttWS extends React.Component {

    constructor(props) {
      super(props)

      this.state = {
        ws: null,
        attempts: 1
      };
    }

    componentWillReceiveProps ({ scriptsLoadedSuccessfully }) {
        if (!scriptsLoadedSuccessfully)  return;

        this.initWebsocket();
    }

    initWebsocket() {
      this.setState((state) => 
        /*global mqtt b:writable*/
        /*eslint no-undef: "error"*/
        ({
          ws: state.ws || mqtt.connect(this.props.url),
          attempts: 1
        })
      );      
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

    componentDidUpdate() {
      this.setupWebsocket()
    }

    setupWebsocket() {
      let websocket = this.state.ws;
      let props = this.props;

      websocket.subscribe("bus/+/events");
      websocket.on("message", function(topic, payload) {
          //alert([topic, payload].join(": "));
          //client.end();
          props.onMessage({ topic: topic, msg: payload});
      });
          

      /*
      websocket.onopen = () => {
        this.logging('Websocket connected');
        if (typeof this.props.onOpen === 'function') this.props.onOpen();
      };

      websocket.onmessage = (evt) => {
        this.props.onMessage(evt.data);
      };

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
        const { scriptsLoadedSuccessfully } = this.props
        if (scriptsLoadedSuccessfully) {
            console.log('init...')
            this.initWebsocket();
        }
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
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    debug: PropTypes.bool,
    reconnect: PropTypes.bool,
    protocol: PropTypes.string,
    reconnectIntervalInMilliSeconds : PropTypes.number
};

export default ScriptLoader('./utils/mqtt.js')(MqttWS)

//export default Websocket;