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
    });
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
    });
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
    });
}

server.put('/api/users/:id', editUserById);

function editUserById(request, response) {
    const { id } = request.params;
    const user = request.body;

    if (!user.name || !user.bio) {
        return response.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }
    
    db.update(id, user)
    .then(userId => {
        if (!userId) {
            return response.status(404).json({ message: "The user with the specified ID does not exist." });
        }
        return response.status(200).json(userId);
    })
    .catch(err => {
        response.status(500).json({ error: "The user information could not be modified." });
    });
}

server.get('*', handleDefaultRequest);

function handleDefaultRequest(request, response) {
    response.json('Hello World!');
}

server.listen(process.env.PORT || 3000, () => {
    console.log('Listening on ' + (process.env.PORT || 3000));
});