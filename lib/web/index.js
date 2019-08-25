/**
 * Init Web Server
 */
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));


if (process.env.NODE_ENV == 'production') {
    const publicDir = __dirname + '/../../build';
    // static folder
    app.use(express.static(publicDir));

    // handle Vue SPA
    app.get(/.*/, (req, res) => {
        res.sendFile(publicDir + '/index.html');
    });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    console.log(err);
    err.status = 404;
    next(err);
});

// catch 5xx errors
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Something broke!')
  next();
});

module.exports = { app }