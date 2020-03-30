const router= require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} =require('../validation')

//Validation


router.post('/register',async (req,res)=>{

    //Validate the data
    const {error} = registerValidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
   //checking if email exist
   const emailExist= await User.findOne({email: req.body.email});
   if(emailExist){
       return res.status(400).send('Email already exist');
   }
    else{
        //hash the password
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(req.body.password, salt);


        //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
    }
   
});

router.post('/login',async (req, res)=>{
//Validate the data
const {error} = loginValidation(req.body);
if(error){
    return res.status(400).send(error.details[0].message);
}
//checking if email exist
const user= await User.findOne({email: req.body.email});
if(!user){
    res.status(404).send({message:'User do not exist'});
}
else{
    const validPassword= await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        return res.status(400).send('Invalid password');
    }
    else{
        //create and assign a token
        const token= jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
        res.header('auth-token',token).send(token)
       
    }
}
});

module.exports= router;