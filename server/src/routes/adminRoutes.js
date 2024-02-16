const  {Employee, Attendance, Admin}  = require('../db/db')
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
    
    const existingAdmn = await Admin.findOne({email})
    if(existingAdmn){
        res.status(400).json({error: "Admin with this email id Alredy exists"})
    }else{
        const admin = new Admin({username, email, password});
        admin.save()
            .then(emp => res.json({messege: "Admin Created Succesfully", admin}))
            .catch(err => res.status(500).json({error: "Not able to create Admin", err}))
    }
})

router.post('/login', async(req, res)=>{
    const parsedInputs = loginInputs.safeParse(req.body);
    if(!parsedInputs.success){
        return res.status(400).json({error: parsedInputs.error})
    }

    let email = parsedInputs.data.email;
    let password = parsedInputs.data.password;
    
    const emp = await Admin.findOne({email, password})
    if(emp){
        const token = jwt.sign(
            { _id: emp._id, email, role: 'admin' },
            SECRET,
            { expiresIn: '26h' }
        );
        res.json({messege: "Logged in succesfully", token})
    }else{
        res.status(400).json({error: "Invalid Creadentials"})
    }
})

router.get('/dashboard', authenticate, async (req, res) => {
    try {
        const employeeData = await Employee.find({});
        const attendanceData = await Attendance.find({});

        if (employeeData && attendanceData) {
           
            const combinedData = {
                employeeData,
                attendanceData
            };
            res.json(combinedData);
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router