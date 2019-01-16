const express = require('express');

const multer = require('multer');
const upload = multer({dest:'uploads/'});//Execute the multer --can pass config to multer //make uploads to static folder in server.js

//Trav
const path = require('path');//DELETE IF NOT USED HERE
const crypto = require('crypto');//To name the files//DELETE IF NOT USED HERE
const GridFsStorage = require('multer-gridfs-storage');//DELETE IF NOT USED HERE
const Grind = require('gridfs-stream');//DELETE IF NOT USED HERE
const methodOverride = require('method-override');//DELETE IF NOT USED HERE


const router = express.Router();
const checkAuth = require('../../middleware/check-auth');

//Item model
const Item = require('../../models/itemsM');
//retailers model
const RetailersM = require('../../models/barbersM');


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

//@route POST api/items
//@desc POST item in the DB
//@access Private
//@call By retailer
                    //Will nomy try to parse onefile --name of the field to be parsed
router.post('/',upload.single('productImage'), checkAuth, (req, res) => {
    console.log("inside /api/items --POST");
    console.log(req.file);//Req.file is accessable because of upload.single('productImage')
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

//@route DELETE api/items
//@desc DELETE item in the DB
//@access Private
//@call By retailer
router.delete('/', checkAuth, (req, res) => {
    //Delete one item
    console.log("inside /api/items --DELETE");
    console.log(req.body.userData.retailerName);
    RetailersM.findOne({
            retailerName: req.body.userData.retailerName
        })
        .exec()
        .then(() => {
                Item.findOne({
                        retailerName: req.body.userData.retailerName,
                        itemName: req.body.itemName

                    }).exec()
                    .then((data) => {
                        Item
                            .remove({
                                itemName: req.body.itemName
                            })
                            .exec()
                            .then(result => {
                                res.status(200).json({
                                    message: 'deleted',
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            });


                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            message: "Item doesn't exist",
                            error: err

                        })
                    })
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