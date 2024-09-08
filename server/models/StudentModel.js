import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const studentSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
         type:String,
         required:true,
         unique:true,
         lowercase:true
    },
    password:{
          type:String,
          required:true
    },
    accessToken:{
        type:String
    },
    refreshToken:String,

    refreshTokenExpiry:String
},{timestamps:true})

studentSchema.methods.isPasswordCorrect = function(password){
    return bcrypt.compare(password,this.password)
} 

studentSchema.methods.generateAccessToken =  function(){
    return jwt.sign({
        _id : this._id,
        name : this.name,
        email : this.email
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})}

    
studentSchema.methods.generateRefreshToken =  function(){
    return jwt.sign({
        _id : this._id,
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}


export const StudentModel = mongoose.model("Student",studentSchema)