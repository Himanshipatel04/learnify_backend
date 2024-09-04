import mongoose, { mongo } from "mongoose";

const MentorSchema = mongoose.Schema({
    name:{
       type:String,
       required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    designation:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    linked:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
})

export const MentorModel = mongoose.model("Mentor",MentorSchema)