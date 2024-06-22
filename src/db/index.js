// import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";



// const dbConnection = async () =>{
//         try {
//          const connectionInstance = await  mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`)
//          console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host} `);
//         } catch (error) {
//             console.log("MONGODB connection error connect mahi hua hai b" , error);
//             process.exit(1)
//         }
// }


// export default dbConnection

// jab bhi ek async method complete hota hai tab hame ke promise return hota hai

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



const dbConnection = async ()=>{
    try {
        const connectionInstance  = await mongoose.connect(`mongodb://localhost:27017/chaiorcode`)
        console.log("db connected");
        // console.log(connectionInstance.connection.host);
    } catch (error) {
        console.log("MONGODB connection error");
        process.exit(1)        
    }
}




export default dbConnection