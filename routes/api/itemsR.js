const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/check-auth');

//Item model
const Item = require('../../models/itemsM');
//retailers model
const RetailersM = require('../../models/retailersM');


//@route GET api/items
//@desc get all items
//@access Public
//@call By any
router.get('/', (req, res) => {
    console.log("inside /api/items");
    Item.find() //Fetch all the items from the database
        .sort({
            date: 1
        }) //sort by the data -1 for desc
        .then(items => res.json(items))
});

//@route POST api/items:/token
//@desc POST item in the DB
//@access Private
//@call By retailer
router.post('/',checkAuth,(req, res) => {
    console.log("inside /api/items --POST");
    RetailersM.find({
            retailerName: rname //rname is the retailerName we get from the token
            //if retailerName is present in RetailersM then that retailer is elegable for storing the data
            //now we add the data in req.body to Item model
        })
        .exec()
        .then(user => res.json(user)) //temp
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
                
            })
        })

});





module.exports = router;