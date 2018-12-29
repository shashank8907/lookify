const express = require('express');
const router = express.Router();

//Item model
const Item = require('../../models/itemsM');

//@route GET api/items
//@desc get all items
//@access Public
//@call By any
router.get('/',(req,res)=>{
    console.log("inside /api/items");
    Item.find()//Fetch all the items from the database
    .sort({date:1})//sort by the data -1 for desc
    .then(items => res.json(items))
});

//@route POST api/items:/token
//@desc POST item in the DB
//@access Private
//@call By retailer
router.post('/',(req,res)=>{
    console.log("inside /api/items --POST");
    //Before we post the item in the DB we get the token fromn the client, verify it, if success
    //use that data to store the item
    
    Item.find()//Fetch all the items from the database
    .sort({date:1})//sort by the data -1 for desc
    .then(items => res.json(items))

});





module.exports = router;