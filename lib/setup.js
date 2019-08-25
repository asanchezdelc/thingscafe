const mqtt = require('./mqtt');
const config = require('./config');
const web = require('./web');
const port = process.env.PORT || 3000;

function init() {
    const server = web.app.listen(port, () => console.log(`App listening on port ${port}!`));
    mqtt.init( { httpServer: server } );
}

module.exports = { init }