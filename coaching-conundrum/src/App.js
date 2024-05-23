import React, {useState, useEffect} from "react";
import Header from "./components/Header"
import Login from './pages/Login'
import Scheduler from './pages/Scheduler'

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/user').then(res => {
      if (res.ok) {
        res.json().then(data => {
          setIsSignedIn(true)
          setUser(data)
        })
      }
    })
  }, []);

  const logout = () => {
    fetch("/api/logout", {
      method: "POST",
    }).then(res => {
      if (res.ok) {
        window.alert("You've logged out!");
        setIsSignedIn(false)
      }
    })
  }

  return (
    <div>
      <Header isSignedIn={isSignedIn} handleLogout={logout}/>
      {isSignedIn ? <Scheduler user={user}/> : <Login setIsSignedIn={setIsSignedIn} setUser={setUser}/>}
    </div>
  );
}

export default App;
