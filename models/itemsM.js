/**
 * This is the schema that represents the items model in the DB
 * it will store the retailer name, item name, price, description and image
 * also date when the item was posted
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema 
const ItemSchema = new Schema({
    itemName:{
        type:String,
        required:true
    }, 
    date:{
        type:Date,
        default: Date.now
    },
    retailerName:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
}); 
//model name and it's schema
module.exports = Item = mongoose.model("items",ItemSchema)
