// require('dotenv').config({path:'./env'})
// ye require wala syntax code ki consistency ko kharab kar raha hai ise ham new syntax se bhi use kar sakte hai lets see vo kess kaam karta hai
// ye import wale syntax ko ek experimental feature ke dwara use kar sakte ahai 

import dotenv from "dotenv"
import dbConnection from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path:'./env'
})



dbConnection()
.then(()=>{

    app.on("error" , (error)=>{
        console.log("ERROR AA GYA HAI jab db connection hone ke baad app ne listen kiya : ", error);
        throw error
    })

    // server is starting
    app.listen(8000 , ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MONGO DB CONNECTION FAILED !!!",error);
})
























// to database connect karne ke broadly two method hai pehla hai ki aap  index.js file me hi matlab entry point wali file me hi database connect karne ka code likh do or usko turant run karwa do dusra method hai ki ek dusri file me code likh do db connection ka fir usko main file me import karwa kr run kar do dono ke apne pros and corns hai alag salag code rakhne se code neat and clean rahega 

// the semicolon before iife is for cleaning purpose or it is good practice