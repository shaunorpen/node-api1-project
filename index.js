// implement your API here
const express = require('express');
const cors = require('cors');

const server = express();

server.use(cors());
server.use(express.json());

server.get('*', handleDefaultRequest);

function handleDefaultRequest(request, response) {
    response.json('Hello World!');
}

server.listen(process.env.PORT || 3000, () => {
    console.log('Listening on ' + (process.env.PORT || 3000));
});