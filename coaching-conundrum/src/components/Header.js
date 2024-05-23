import React from "react";
import '../styles/Header.css'

function Header(props) {
    const {isSignedIn, handleLogout} = props
    return (
        <header className="App-header">
            Coach Scheduler
            {isSignedIn ? (<button onClick={handleLogout}>LOGOUT</button>) : null}
        </header>
    )
}

export default Header