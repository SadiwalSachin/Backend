import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//use method sare ke sare middleware or configuration ke liye use me aata hai production level par is cors me object define karke options bhi aate hai  //
// jab bhi aap middleware use karte hai to app.use se karte hai 
// cors ek middle ware hai 


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({
    limit:"20kb"
}))

app.use(express.urlencoded({
    extended:true,
    limit:"20kb"
}))

app.use(express.static("public"))

app.use(cookieParser())


// pehle express json nahi le pata tha hame body parser ka use karna padta tha 

// routes
import userRouter from "./routes/user.route.js"

// route dclaration

app.use("/api/v1/users" , userRouter) // user ke liye user.route.js me banenge

export { app }