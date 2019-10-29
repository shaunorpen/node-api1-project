import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [updatedUser, setUpdatedUser] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/users")
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  }, [updatedUser]);

  return (
    <div
      className="App"
      style={{
        margin: "0 auto",
        width: "800px"
      }}
    >
      {users.map(user => (
        <UserCard user={user} key={user.id} setUpdatedUser={setUpdatedUser} />
      ))}
      <UpdateUserForm setUpdatedUser={setUpdatedUser} />
    </div>
  );
}


function UserCard({ user, setUpdatedUser }) {
  
  function deleteUser(id, setUpdatedUser) {
    axios
      .delete(`http://localhost:3000/api/users/${id}`)
      .then(res => {
        setUpdatedUser(res);
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  return (
    <div>
      <h2>User Details</h2>
      <p>User Name: {user.name}</p>
      <p>User Bio: {user.bio}</p>
      <button onClick={() => deleteUser(user.id, setUpdatedUser)}>
        Delete
      </button>
    </div>
  );
}

function UpdateUserForm({ setUpdatedUser }) {
  const initialFormValues = {
    name: "",
    bio: ""
  };
  const [userForm, setUserForm] = useState(initialFormValues);

  const handleChange = evt => {
    setUserForm({
      ...userForm,
      [evt.target.name]: evt.target.value
    })
  }

  const handleSubmit = (user, setUpdatedUser) => () => {
    axios
    .post('http://localhost:3000/api/users', user)
    .then(res => {
      setUserForm(initialFormValues);
      setUpdatedUser(res);
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  return (
    <div>
      <h2>Add New User</h2>
      <label htmlFor="name">Name:</label>
      <input type="text" name="name" value={userForm.name} onChange={handleChange} />
      <label htmlFor="bio">Bio:</label>
      <input type="text" name="bio" value={userForm.bio} onChange={handleChange} />
      <button onClick={handleSubmit(userForm, setUpdatedUser)} >Submit</button>
    </div>
  );
}

export default App;
