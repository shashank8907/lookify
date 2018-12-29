 //This is a default middleware pattern we use in our express app 
 //We imort this in items route file and use it to attach it to certain routes
 //We add it in route get/post function.
 //only after the middleware is a success will the route be executed
 //jwtsign is to create a token
 //jwtverify is for verifying an incommig token a token --this function accepts our secret and token
 const jwt = require("jsonwebtoken");
 const jwtKeyC = require('../config/keys').jwtKey
 module.exports = (req, res, next) => {
     //Verify and then return the decoded value //Will return err if failed so we place it a try
    //  console.log(req.body.token);// send token from header 
    const token = req.headers.authorization.split(" ")[1];
    console.log(token); 
    try {
         const decoded = jwt.verify(token, jwtKeyC);
         req.body.userData = decoded;
         //In future requests which use this middleware in front of it we could extract the userData
         next();
     }catch(error){
        return res.status(401).json({
            // message:'Auth failed'
            message: 'token error'
        });
     }

 };