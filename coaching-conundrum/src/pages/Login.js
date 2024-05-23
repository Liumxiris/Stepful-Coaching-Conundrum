import React, { useState } from 'react';

function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {setIsSignedIn, setUser} = props

    const handleLogin = async (event) => {
        event.preventDefault();
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(res => {
            if (res.ok) {
                window.alert("Successfully Logged in")
                res.json().then(data => {
                    console.log("logged user", data)
                    setIsSignedIn(true)
                    setUser(data)
                })
            } else {
                window.alert("Login Failed")
            }
        }).catch(error => {
            throw(error)
        })
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login