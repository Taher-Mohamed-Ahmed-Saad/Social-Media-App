const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// create express application
const app = express();

// letting the .env file works
dotenv.config();

// connect to the database then listen to requests
mongoose.connect(process.env.MONGO_URL , {useNewUrlParser : true , useUnifiedTopology: true})
    .then((result)=> app.listen(8080,()=> console.log('Backend server is running')))
    .catch((err)=> console.log(err));

// middlewares
app.use(express.json());        // body parser for the post requests
app.use(helmet());
app.use(morgan('dev')); 

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute); 
