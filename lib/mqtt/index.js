const mosca = require('mosca');

const backend = {
    type: 'redis',		
    redis: require('redis'),
    host: "localhost"
};

function init(options) {
    const moscaSettings = {
        port: process.env.MQTT_PORT || 1883, //mqtt port
        backend: backend
    };
      
    let server = new mosca.Server(moscaSettings);	//here we start mosca
    server.attachHttpServer(options.httpServer);

    server.on('ready', setup);	//on init it fires up setup()
      
    // fired when the mqtt server is ready
    function setup() {
        console.log(`MQTT server is running on port ${moscaSettings.port}`)
    }

    server.on('clientConnected', client => {
        console.log(`new client ${client} connected`);
    });


    server.on('published', (topic, payload) => {
        console.log(topic);
    });





}

module.exports = { init }