import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [updatedUser, setUpdatedUser] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3000/api/users')
    .then(res => {
      setUsers(res.data);
    })
    .catch(err => {
      console.log(err.message);
    })
  }, [updatedUser]);

  return (
    <div className="App">
      {
        users.map(user => <UserCard user={user} key = {user.id} setUpdatedUser={setUpdatedUser} />)
      }
    </div>
  )
}

function deleteUser(id, setUpdatedUser) {
  axios.delete(`http://localhost:3000/api/users/${id}`)
  .then(res => {
    debugger
    setUpdatedUser(res);
  })
  .catch(err => {
    console.log(err.message);
  })
}

function UserCard({ user, setUpdatedUser }) {
  return (
    <div>
      <p>User Name: {user.name}</p>
      <p>User Bio: {user.bio}</p>
      <button onClick={() => deleteUser(user.id, setUpdatedUser)} >Delete</button>
    </div>
  );
}

export default App;
