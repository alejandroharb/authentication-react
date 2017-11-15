const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const app = express();
const mongoose = require('mongoose');

//DB setup
mongoose.connect('mongodb://localhost/auth', {
    useMongoClient: true
});

// App setup
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
app.listen(port, () => {
    console.log('listening on ', port);
});
