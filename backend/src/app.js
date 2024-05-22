import express, {response} from "express"

const app = express()

app.get('/',(req, res)=> {
    console.log("app is running")
})

export default app;