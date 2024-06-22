import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
// direct encryption of password is not possible hai mongoose ke kuch hooks ki jarurat padti hai

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        // mongodb me agar kisi field ko searchable bana hai or behtar tarike se to uske liye index ko true kar do 
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, // cloudinarry url 
        required:true
    },
    coverImage:{
        type:String, // cloudinarry url 
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"video"
        }
    ],
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

// ye jo pre method har baar chalega jab jab data save hoga to ye ek problem hai ki koi agar avatar aakar change kar raha hai to har baar password change ho jayega to ham kya chahte hai ki ye sirf jab chale jab me password change karu ya first time save karu iske liye muze kuch code or likhna padega if else ke andar yaha hame ek method mlta hai ki koi filed update ho rahi hai kya this.isModified("password") isme jo isModified hai uske andar aapko password ko "" inme bhejna hai 
userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            // refresh token me info kam hoti hai 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    ) 
}

export const User = mongoose.model("User",userSchema)


