const  {Employee}  = require('../db/db')
const express = require('express');
const router = express.Router();
const z = require('zod');
const jwt = require('jsonwebtoken');
const {SECRET, authenticate} = require('../middlewares/authMiddleware')

//signup input schemas 
const signuInputs = z.object({
    username: z.string().min(4).max(40),
    email: z.string().email(),
    password: z.string().min(4)
})

//login input schemas 
const loginInputs = z.object({
    email: z.string().email(),
    password: z.string().min(4)
});

router.post('/signup', async(req, res)=>{
    const parsedInputs = signuInputs.safeParse(req.body);
    if(!parsedInputs.success){
        return res.status(400).json({error: parsedInputs.error})
    }
    let username = parsedInputs.data.username;
    let email = parsedInputs.data.email;
    let password = parsedInputs.data.password;
    
    const existingEmp = await Employee.findOne({email})
    if(existingEmp){
        res.status(400).json({error: "Employee with this email id Alredy exists"})
    }else{
        const emp = new Employee({username, email, password});
        emp.save()
            .then(emp => res.json({messege: "Employee Created Succesfully", emp}))
            .catch(err => res.status(500).json({error: "Not able to create employee", err}))
    }
})

router.post('/login', async(req, res)=>{
    const parsedInputs = loginInputs.safeParse(req.body);
    if(!parsedInputs.success){
        return res.status(400).json({error: parsedInputs.error})
    }

    let email = parsedInputs.data.email;
    let password = parsedInputs.data.password;
    
    const emp = await Employee.findOne({email, password})
    if(emp){
        const token = jwt.sign({email, role:'emp'}, SECRET, {expiresIn : '1h'});
        res.json({messege: "Logged in succesfully", token})
    }else{
        res.status(400).json({error: "Invalid Creadentials"})
    }
})

router.post('/checkin', authenticate, (req,res)=>{
    const checkinTime = new Date();

    res.send(checkin);
})
module.exports = router