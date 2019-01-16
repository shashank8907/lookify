const express = require('express');
const mongoose = require('mongoose');
mongoose.set('debug', true)
const bcrypt = require('bcrypt');
const router = express.Router();
// const ItemM = require('../../models/itemM'); not needed DELETE
const BarbersM = require('../../models/barbersM');//change Remove
//Model for users
const UsersM = require('../../models/usersM');//change Remove

//Json web token
const jwt = require('jsonwebtoken');
//Get the jwt key
const jwtKeyC = require('../../config/keys').jwtKey;



//@route post /api/retailers/reg
//@desc register retailer --get the data from the front and store it in DB
//@access Public
router.post('/reg', (req, res) => {
    //Check if the retaiuler is already in the database first 
    UsersM.find({
        userName: req.body.userName
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                //If user exists
                console.log(user)
                return res.status(409).json({
                    message: "barberusername of already taken, if you are an existing user try logging-in else choose another username"
                })
            } else {
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    // Store hash in your password DB.
                    if (err) {
                        //internal server error
                        return res.status(500).json({
                            error: err
                        });
                    } else {

                        var usersObj = new UsersM({
                            userName: req.body.userName,
                            name:req.body.name,
                            email: req.body.email,
                            password: hash
                        });
                        usersObj
                            .save()
                            .then(results => {
                                console.log(results);
                                //Created because user has been created
                                res.status(201).json({
                                    message: 'user is created successfully  redirect to login page'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });

            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

//@route post /api/retailers/login
//@desc register retailer --get the data from the front and store it in DB
//@access Private
router.post('/login', (req, res) => {
    //here we get retailerUsername and password from frontend req body  
    console.log(req.body.barberUsername+ "---------barberUsername @#$-------")
    BarbersM.findOne({
        barberUsername: req.body.barberUsername
        })
        .exec()
        .then(user => {
            if (user) {
                //If the user exists in the DB check the passworder provided by him/her matches 
                //How does bcrypt compare work?
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    if (err) {
                        console.log(err)
                        return res.status(401).json({
                            message:"Password did not match"
                        })
                    }
                    if (result) {
                        const token = jwt.sign({
                            //Data in token are not ment for client to extract
                            barberUsername:user.barberUsername,
                            email:user.email,
                            userId:user._id
                        },jwtKeyC,{
                            expiresIn:"1h"
                        })
                        return res.status(200).json({
                            message: "Auth successful",
                            token: token

                        })
                    }
                    //If it doesn't enter any else block
                    res.status(401).json({
                        // message: "Auth failed",
                        message: " At login ERROR"
                    })

                });

            } else {

                return res.status(401).json({
                    //We can give user not exists but it's not safe
                    //because hacker can get a list of users that are registerd through bruteforce
                    message: "Auth failed"

                })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});



//@route POST api/users/delete
//@desc route to delete user
//@access  Private  
router.delete('/delete/:userId', (req, res, next) => {
    // console.log(req.params.userId);
    BarbersM.remove({
            _id: req.params.userId
        })
        .exec()
        .then(results => {
            //OK
            console.log(results)
            return res.status(200).send({
                message: "User Deleted"
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });

});

module.exports = router;