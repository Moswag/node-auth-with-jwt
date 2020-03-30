const express = require('express');
const app=express();
const dotenv=require('dotenv');
const mongoose = require('mongoose');
//Import routes
const authRoute=require('./routes/auth');
const postRoute= require('./routes/post')


dotenv.config();

//connect to db
mongoose.connect(process.env.DB_CONNECT,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, ()=> console.log('Connected to db'));

//Middleware
app.use(express.json());


//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

//Error handling
//not found
app.use((req,res,next)=>{
    const error=new Error('Not found');
    error.status=404;
    next(error);
});
//any other type
app.use((error,req,res,next)=>{
    res.status(error.status || 500).json({
        error:{
            message:error.message
        }
    });
});

app.listen(3000, ()=> console.log('Server running'));