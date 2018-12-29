const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema 
const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
}); 

module.exports = User = mongoose.model("user",userSchema)
