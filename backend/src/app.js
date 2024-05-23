import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session'
import cookieParser from 'cookie-parser'
import * as db from "./database.js"

const app = express()
app.use(
    cookieSession({
        secret:"cookiesecret",
        signed: false,
        name: "__session"
    })
)
app.use(cookieParser())
app.use(bodyParser.json())

app.get('/', (req,res) => {
    
})

app.get('/api/user', async(req,res) => {
    if (req.session.userID) {
        console.log("user has logged")
        return res.status(200).send({userID:req.session.userID, userType:req.session.userType})
    } else {
        console.log("no user logged in")
        return res.status(401).json({ message: 'No Logged User.'});
    }
})

app.post('/api/login', async(req, res)=> {
    const {username, password} = req.body;
    db.getUser(username).then(user => {
        if (user && user.password === password){
            req.session.userType = user.userType
            req.session.userID = user._id
            return res.status(200).send({userID:req.session.userID, userType:req.session.userType});
        } else {
            return res.status(401).json({ message: 'Authentication failed.' });
        }
    })
})

app.post('/api/logout', async(req,res) => {
    req.session = null
    res.clearCookie()
    return res.status(200).json({ message: 'Logout Successfully.'});
})

app.post('/api/addSlot', (req,res) => {
    const userID = req.session.userID
    if (userID) {
        const {date, startTime} = req.body
        console.log("time", req.body)
        const newSlot = db.addSlot(userID,date,startTime).then(result => {
            if (result) {
                return res.status(200).send("Created new slot")
            } else {
                return res.status(400).send("Error creating slot")
            }
        })
    } else {
        return res.status(401).send("No user logged in")
    }
})

app.get('/api/fetchSlot', (req,res) => {
    const userID = req.session.userID
    if (userID) {
        db.fetchingSlot(userID).then(result => {
            if (result) {
                return res.status(200).send(result)
            } else {
                return res.status(400).send("Error fetching slots")
            }
        })
    } else {
        return res.status(401).send("No user logged in")
    }
})

app.get('/api/fetchAllSlot', (req,res) => {
    const userID = req.session.userID
    if (userID) {
        db.fetchingAllSlot().then(result=> {
            if (result) {
                return res.status(200).send(result)
            } else {
                return res.status(400).send("Error fetching slots")
            }
        })
    } else {
        return res.status(401).send("No user logged in")
    }
})

app.post('/api/bookSlot', (req,res) => {
    const userID = req.session.userID
    if (userID) {
        const {slotInfo} = req.body
        db.bookSlot(userID, slotInfo).then(result => {
            if (result) {
                return res.status(200).send("Booked the Slot")
            } else {
                return res.status(400).send("Error Booking the solt")
            }
        })
    } else {
        return res.status(401).send("No user logged in")
    }
})

app.get('/api/fetchAllCalls', (req,res) => {
    const userID = req.session.userID
    if (userID) {
        db.fetchAllCalls(userID).then(result => {
            if (result) {
                return res.status(200).send(result)
            } else {
                return res.status(400).send("Error Fetching all Calls")
            }
        })
    } else {
        return res.status(401).send("No user logged in")
    }
})

export default app;