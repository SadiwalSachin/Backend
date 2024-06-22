// import {v2 as cloudinary} from "cloudinary"
// import exp from "constants";
// import fs from "fs"

          
// cloudinary.config({ 
//   cloud_name:process.env.CLOUDINARY_CLOUDE_NAME , 
//   api_key: process.env.CLOUDINARY_API_KEY, // ye sensitive info hai isko env me rakha padega
//   api_secret: process.env.CLOUDINARY_API_SECRET 
// });

// const fileUploaderOnCloudinary = async (filePath) =>{
//     try {
//         if(!filePath) return null
//         // if file is there then upload to it
//         const response = await cloudinary.uploader.upload(filePath , {
//             resource_type:"auto"
//         })
//         console.log(response);        //file has been uploaded successfully
//         console.log("file has uploaded on cloudinary" , response.url);
//         return response

//     } catch (error) {
//         fs.unlinkSync(filePath) //remove the locally saved file as the uploadd operatin got failed
//         return null
//     }
// }

// export {cloudinary}



import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUDE_NAME , 
  api_key: process.env.CLOUDINARY_API_KEY, // ye sensitive info hai isko env me rakha padega
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const fileUploaderOnCloudinary = async (localFilePath) =>{
    try {
        if (!localFilePath) return null
        //  upload the file on cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type:"auto"
        }) // is response me file upload hone ke baad cloudinary ka url mil jayeg 

        console.log(response.url);

        return response // is pure function ko user use karega file upload ke liye to ham use pura response return kar denge
    } catch (error) {
        // ham ye chahte hai ki agar cloudinary par file upload nahi hoti hai to hamare server par to file padi hai or hamare server par vo faaltu hai to ham use hata denge
        fs.unlinkSync(localFilePath) // remove the locally save temprory file as the operation got failed
        // unlinkSync ka matlab pehle ye file hatni hi chaiye uske baad ham dusra kaam karenge
        return null
    }
}

export {fileUploaderOnCloudinary}