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
router.post('/', checkAuth, (req, res) => {
    console.log("inside /api/items --POST");
    console.log(req.body.userData.retailerName)
    RetailersM.findOne({
            retailerName: req.body.userData.retailerName
        })
        .exec()
        .then(user => {

                var item = new Item({
                    retailerName: req.body.userData.retailerName,
                    itemName: req.body.itemName,
                    price: req.body.price,
                    description: req.body.description,
                    image: req.body.image
                });
                item
                    .save()
                    .then(results => {
                        console.log(results);
                        //Created because user has been created
                        res.status(201).json({
                            message: 'The item has been added'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            }

        )
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err

            })
        })

});





module.exports = router;