const express = require('express');
const mongoose = require('mongoose');
mongoose.set('debug', true)
const bcrypt = require('bcrypt');
const router = express.Router();
// const ItemM = require('../../models/itemM'); not needed DELETE
const RetailersM = require('../../models/retailersM');
//Json web token
const jwt = require('jsonwebtoken');
//Get the jwt key
const jwtKeyC = require('../../config/keys').jwtKey;



//@route post /api/retailers/reg
//@desc register retailer --get the data from the front and store it in DB
//@access Public
router.post('/reg', (req, res) => {
    //Check if the retaiuler is already in the database first 
    RetailersM.find({
        retailerName: req.body.retailerUsername
        })
        .exec()
        .then(user => {
            //when find() is used if no entry is ther then user is [] not null
            if (user.length >= 1) {
                //If user exists
                console.log(user)
                //409 confilct 422-unprocessable entity
                return res.status(409).json({
                    message: "retailerusername of already taken, if you are an existing user try logging-in else choose another username"
                })
            } else {
                //new user
                //Add randon strings before we hash our plaintext password
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    // Store hash in your password DB.
                    if (err) {
                        //internal server error
                        return res.status(500).json({
                            error: err
                        });
                    } else {

                        var retailerObj = new RetailersM({
                            retailerName: req.body.retailerUsername,
                            name:req.body.name,
                            email: req.body.email,
                            password: hash
                        });
                        // When the userobject is saved we check the results and send message "success"
                        //If save failed we catch the error and print the error before sinding 500 error with 
                        // with a json object --thing to notice
                        retailerObj
                            .save()
                            .then(results => {
                                console.log(results);
                                //Created because user has been created
                                res.status(201).json({
                                    message: 'reatailer User created redirect to page where he/she can add item'
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

//@route POST api/users/login
//@desc When registered user wants to login hit this route
//@access  Public 
router.post('/login', (req, res) => {
    //Get email and password from here and search in database 
    RetailersM.findOne({
            userName: req.body.username
        })
        .exec()
        .then(user => {
            if (user) {
                //else the user exists 
                //Here we check the password that received is same as in DB
                //After bcrypt we cant reverse it, Then how can we check
                //WE hash the input with same algorithm and match the result? but what if hacker use dictionary??
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    if (err) {
                        console.log(err)
                        return res.status(401).json({
                            //We can give user not exists but it's not safe
                            //because hacker can get a list of users that are registerd through bruteforce
                            // message: "Auth failed"
                            message:"Auth err"
                        })
                    }
                    if (result) {
                        //When the Auth is successful we use jwt
                        //We use this to maintain session securly
                        //Payload: What do we want to pass to the client
                        //SecretOrPrivateKey: an d
                        //options: obj where we define options of sign() process
                        //callback: here we get our token
                        const token = jwt.sign({
                            username:user.userName,
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
                        message: "no err no "
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
    RetailersM.remove({
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