const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema 
const appointmentSchema = new Schema({
    userName:{
        type:String,
        required:true
        },
    barberName:{
        type:String,
        required:true
    },
    oN:{
        type:String,
        required:true
    }
   
}); 

module.exports = Appointment = mongoose.model("appointment",appointmentSchema)
