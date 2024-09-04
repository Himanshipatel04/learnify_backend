import mongoose from "mongoose";

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
    }
},{timestamps:true})


export const StudentModel = mongoose.model("Student",studentSchema)