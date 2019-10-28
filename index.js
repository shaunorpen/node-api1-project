const express = require('express');
const cors = require('cors');
const db = require('./data/db');

const server = express();

server.use(cors());
server.use(express.json());

server.post('/api/users', createNewUser);

function createNewUser(request, response) {
    const user = request.body;
    
    if (!user.name || !user.bio) {
        return response.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } 

    db.insert(user)
    .then(userId => {
        return response.status(201).json(userId);
    })
    .catch(err => {
        return response.status(500).json({ error: "There was an error while saving the user to the database" });
    })
}

server.get('/api/users', getAllUsers);

function getAllUsers(request, response) {
    db.find()
    .then(users => {
        return response.status(200).json(users);
    })
    .catch(err => {
        return response.status(500).json({ error: "The users information could not be retrieved." });
    })
}

server.get('/api/users/:id', getUserById);

function getUserById(request, response) {
    const { id } = request.params;
    db.findById(id)
    .then(user => {
        if (!user) {
            return response.status(404).json({ message: "The user with the specified ID does not exist." });
        }
        return response.status(200).json(user);
    })
    .catch(error => {
        response.status(500).json({ error: "The user information could not be retrieved." });
    })
}

server.delete('/api/users/:id', deleteUserById);

function deleteUserById(request, response) {
    const { id } = request.params;
    db.remove(id)
    .then(res => {
        if (!res) {
            return response.status(404).json({ message: "The user with the specified ID does not exist." });
        }
        return response.status(200).json(res);
    })
    .catch(err => {
        return response.status(500).json(err);
    })
}

server.put('/api/users/:id', editUserById);

function editUserById(request, response) {
    // When the client makes a `PUT` request to `/api/users/:id`:
    
    // - If the _user_ with the specified `id` is not found:
    
    //   - return HTTP status code `404` (Not Found).
    //   - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.
    
    // - If the request body is missing the `name` or `bio` property:
    
    //   - cancel the request.
    //   - respond with HTTP status code `400` (Bad Request).
    //   - return the following JSON response: `{ errorMessage: "Please provide name and bio for the user." }`.
    
    // - If there's an error when updating the _user_:
    
    //   - cancel the request.
    //   - respond with HTTP status code `500`.
    //   - return the following JSON object: `{ error: "The user information could not be modified." }`.
    
    // - If the user is found and the new information is valid:
    
    //   - update the user document in the database using the new information sent in the `request body`.
    //   - return HTTP status code `200` (OK).
    //   - return the newly updated _user document_.
}

server.get('*', handleDefaultRequest);

function handleDefaultRequest(request, response) {
    response.json('Hello World!');
}

server.listen(process.env.PORT || 3000, () => {
    console.log('Listening on ' + (process.env.PORT || 3000));
});