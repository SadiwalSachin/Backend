import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { fileUploaderOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// const generateAccessAndRefreshToken = async (userId) => {

//   try {
//     const user = await User.findById(userId);
//     const refreshToken = user.generateRefreshToken();
//     const accessToekn = user.generateAccessToken();

//     user.refreshToken = refreshToken;
//     // ab database me refreshToken save karane ke liye save method chalana hoga
//     // jab bhi database me kuch save karaoge to sab kick in ho jayega use bacahne ke liye ue karna hai {validateBeforeSave :false}
//     await user.save({ validateBeforeSave: false });

//     return {
//       accessToekn,
//       refreshToken,
//     };
//   } catch (error) {
//     throw new ApiError(
//       500,
//       "something went wrong while generating refresh and access tokem"
//     );
//   }
// };

const generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({validateBeforeSave : false})
       
      return {accessToken , refreshToken}

    } catch (error) {
      throw new ApiError(500 , "Something went wrong while generating refresh and access token")
    }

}

const registerUser = asyncHandler(async (req, res) => {
  // take user info
  // validation for empty string and like more thing
  // check is this user exixted if user user does not exist then take the images from user

  // TAKING INFO FROM USER
  const { fullName, email, username, password } = req.body;
  console.log(fullName, email, username, password);

  // file upload ke liye multer ka middleware inject karenge user.routes.js me

  // validation of empty
  // if(username === ""){
  //     throw new ApiError(400 , "enter full name ")
  // }

  //VALIDATION FOR EMPTY STRING
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are compulsory or required");
  }

  //CHECKING FOR EXIXTENCE OF THAT USER
  const exisitedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (exisitedUser) {
    throw new ApiError(409, "User already exists with this username or email");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avtar file is required");
  }

  const avatar = await fileUploaderOnCloudinary(avatarLocalPath);
  const coverImage = await fileUploaderOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avtar file is required");
  }

  const createdUser = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // select method me vo likhna jo jo nahi chiaye
  const findedUser = await User.findById(createdUser._id).select(
    "-password -refreshToken"
  );

  if (!findedUser) {
    throw new ApiError(500, "something went wrong while registering useeer");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // take data from req body
  // check username or email
  // find the user
  // password check if user got
  // access and refresh token generate and send
  // send secure cookie

  const {email , username , password} = req.body

  if(!username || !email){
    throw new ApiError(400,"username or email is required")
  }

  // $or this is mongoDB operator

  const user = await User.findOne({
    $or :[{username} , {email}]
  })

  if (!user) {
    throw new ApiError(404 , "user does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401 , "wrong password entered , password incorrect")
  }

  const {refreshToken , accessToken} = await generateAccessAndRefreshToken(user._id)

  // user.refreshToken = refreshToken;
  // user.save({validateBeforeSave : false})

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  // cookie bhejne ke liye kuch option defined karne honge hota ye hai ki frontend par koi bhi cookie modifie kar sakta hai use bachane ke liye ham option banate hai httpOnly karne se sirf backend par hi cookie modifie ho sakti hai 

  const options = {
    httpOnly : true,
    secure:true
  }

  return res
  .status(200)
  .cookie("accessToken" , accessToken , options)
  .cookie("refreshToken" , refreshToken , options)
  .json(
    new ApiResponse(
      200,
      {
        user : loggedInUser , accessToken , refreshToken
        // yaha refreshToken or accessToken is liye bhej 
      },
      "User logged in successfully"
    )
  )
});

const logOut = asyncHandler( async (req ,res)=>{
    const user =  await User.findByIdAndUpdate(req.user._id , 
      {
        // ab set karne ke liye mongoDb ka set operator use karna hoga 
        $set:{
          refreshToken:undefined 
        }
        // ab iske baad return me agar updated value chiaye to yaha ek new object pass karo use new value milegi

      },        {
        new:true
      })

      const options = {
        httpOnly:true,
        secure:true
      }

      return res.status(200)
      .clearCookie("accessToken" , options)
      .clearCookie("refreshToken" , options)
      .json(
        new ApiResponse(200,user,
          "User logout successfully"
        )
      )

})

const changeCurrentPassword = asyncHandler( async ( req , res ) => {
  const { oldPassword , newPassword } = req.body

  const user =  await User.findById(req.user?._id)

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new ApiError(404,"Invalid old password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {},
      "PAssword changed successfully"
    )
  )
} )

const getCurrentUser = asyncHandler( async ( req , res ) => {
  return res.status(200)
  .json(
    200,
    req.user,
    "current user fetched successfully"
  )
} )

const updateAccountDetails = asyncHandler( async ( req , res ) => {
  const {fullName,email} = req.body

  if (!fullName || !email) {
    throw new ApiError(400 , "All fields are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        fullName,
        email
      }
    },
    {new:true}
  ).select("-password")

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      user,
      "account details updated successfully"
    )
  )
} )

const updateUserAvatar = asyncHandler( async( req , res ) => {
  const avatarLocalPath =  req.file?.path

  if (!avatarLocalPath) {
    throw new ApiError(400 ,"avtar file is missing")
  }

  const avatar = await fileUploaderOnCloudinary(avatarLocalPath)

  if (!avatar.url) {
    throw new ApiError(400,"Avatar while uploading on cloudinary")
  }

  const user =  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{ 
        avatar : avatar.url 
      }
    },
    {new:true}
  ).select("-password")

  return res.status(200)
  .json(
    new ApiResponse(
    200,
    user,
    "avatr uploaded successfully"
  ))
} )

export { registerUser, loginUser , logOut , changeCurrentPassword , getCurrentUser , updateAccountDetails , updateUserAvatar };
