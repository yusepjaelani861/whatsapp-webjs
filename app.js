require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

global.express = express;
global.errorHandler = require('./middleware/error');
global.asyncHandler = require('./middleware/async');
global.errorResponse = require('./utils/errorResponse');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(errorHandler);

const whatsapp = require('./controllers/whatsapp');

whatsapp.auto();

app.post('/api/v1/whatsapp/send-message', whatsapp.send_message);
app.get('/api/v1/whatsapp/create_qr', whatsapp.create_qr);

// app.use('/api/v1/whatsapp', whatsapp);

app.get('/', (req, res) => {
    res.send('Hello World!');
})

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
})