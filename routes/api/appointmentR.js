//Here we are implimenting appointments routes 
//Here using this route user can book the appointment of the barber
//Only user can book an appointment 

const express = require('express');

const multer = require('multer');
const upload = multer({
    dest: 'uploads/'
}); //Execute the multer --can pass config to multer //make uploads to static folder in server.js

//Trav
const path = require('path'); //DELETE IF NOT USED HERE
const crypto = require('crypto'); //To name the files//DELETE IF NOT USED HERE
const GridFsStorage = require('multer-gridfs-storage'); //DELETE IF NOT USED HERE
const Grind = require('gridfs-stream'); //DELETE IF NOT USED HERE
const methodOverride = require('method-override'); //DELETE IF NOT USED HERE


const router = express.Router();
const checkAuth = require('../../middleware/check-auth');

//appointment model
const AppointmentM = require('../../models/appointmentM');
//Barber model
const BarbersM = require('../../models/barbersM');
//users model
const UsersM = require('../../models/usersM');

const Item = require('../../models/itemsM');



// by now we know that the user can book an appointment

// we need to add a route such that the after the barber loggsin we all his appointments will be displayed on his homepage --imp here itself
// we need to add a route such that after the user loggs in we display all his appointments in his homepage -- imp here itself
// 


//@route GET api/items
//@desc get all items
//@access Public
//@call By any
router.get('/', (req, res) => {
    console.log("inside /api/book");
    Item.find() //Fetch all the items from the database
        .sort({
            date: 1
        }) //sort by the data -1 for desc
        .then(items => res.json(items))
});

//@route POST api/appointment
//@desc POST item in the DB
//@access Private
//@call By user

router.post('/', checkAuth, (req, res) => {
    console.log("inside /api/appointment --POST");
    console.log(req.body.userData.key)
    // Here this route should only be accessed by user so .. we chek the key and if k!= user disgard

    //Hwere we get the details for username from jwt token 
    //barber name from body
    //appointment date and time as a string "ON"
    if (req.body.userData.key === 'user') {
        // Check if that user is present in the the user DB'
        BarbersM.findOne({
            name: req.body.barberName
        }, function (err, barb) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    error: err

                })
            }
            if (barb) {
                if (barb.name === req.body.barberName) {
                    var appointment = new AppointmentM({
                        userName: req.body.userData.userName,
                        barberName: req.body.barberName,
                        oN: req.body.oN
                    });
                    appointment
                        .save()
                        .then(results => {
                            console.log(results);
                            //Created because user has been created
                            res.status(201).json({
                                message: 'The appointment has been added'
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });

                }
            } else {
                console.log(err);
                res.status(500).json({
                    message: "No such barber",
                    error: err
                });
            }
        })

    } else {
        res.status(500).json({
            error: err
        })
    }
});

//@route DELETE api/appointment
//@desc DELETE item in the DB
//@access Private
//@call By barber or user
router.delete('/', checkAuth, (req, res) => {
    //Delete one item
    console.log("inside /api/appointment --DELETE");
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