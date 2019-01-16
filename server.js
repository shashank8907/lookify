const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');


const appointment = require('./routes/api/appointmentR');//change Remove or replace wiith appointment 
const barbers = require('./routes/api/barbersR');//change
const users =  require('./routes/api/usersR');


const app = express();

//Trav
// const path = require('path');//DELETE IF NOT USED HERE
const crypto = require('crypto');//To name the files//DELETE IF NOT USED HERE
const GridFsStorage = require('multer-gridfs-storage');//DELETE IF NOT USED HERE
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');// Will only use if necessary//DELETE IF NOT USED HERE


//INIT GFS
//When our database is open we want to set gfs var to Grid which is our gridfs-stream
// conn.o


//debug mongoose
mongoose.set('debug', true)

// app.use(bodyParser.json()) --removed this from the original tutorial  

//bodyparser as middleware
app.use(bodyParser());

//DB Config
const db = require('./config/keys').mongoURI;

console.log(db)
//connect to mongo

mongoose
.connect(db)
.then(()=>console.log("Mongoo db connected..."))
.catch(err => console.log(err));

//Use routes for appointment 
app.use('/api/appointment',appointment);

//user route for barbers
app.use('/api/barbers/',barbers);


//user route for users
app.use('/api/users/',users);


//Serve static assets(build folder ) if we are in production 
if(process.env.NODE_ENV === 'production'){
    //Set static folder
    app.use(express.static('client/build'));
    //Anything other than our specified routs will come here and load index.html file
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    });
}
// for heroku: process.env.PORT
const port = process.env.PORT||5000;

app.listen(port,()=>console.log(`Server started on port...${port}`));

