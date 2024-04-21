// require('dotenv').config({path:'./env'})
// ye require wala syntax code ki consistency ko kharab kar raha hai ise ham new syntax se bhi use kar sakte hai lets see vo kess kaam karta hai
import dotenv from "dotenv"
import dbConnection from "./db/index.js";

dotenv.config({
    path:'./env'
})



dbConnection()








/*
import express from "express"
const app = express()

;( async () => {
    try {
       await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`)
       app.on("error" , (error)=>{
        console.log("ERROR : " , error);
        throw error
       })


       app.listen(process.env.PORT , ()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
       })

    } catch (error) {
        console.log("ERROR : " , error);
    }
} )()

*/

















// to database connect karne ke broadly two method hai pehla hai ki aap  index.js file me hi matlab entry point wali file me hi database connect karne ka code likh do or usko turant run karwa do dusra method hai ki ek dusri file me code likh do db connection ka fir usko main file me import karwa kr run kar do dono ke apne pros and corns hai alag salag code rakhne se code neat and clean rahega 

// the semicolon before iife is for cleaning purpose or it is good practice