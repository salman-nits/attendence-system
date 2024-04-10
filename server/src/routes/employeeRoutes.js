const  {Employee, Attendance}  = require('../db/db')
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
            .then(empl => res.json({messege: "Employee Created Succesfully", emp:{username: empl.username, email: empl.email}}))
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
        const token = jwt.sign(
            { _id: emp._id, email, role: 'emp' },
            SECRET,
            { expiresIn: '14h' }
        );
        res.json({messege: "Logged in succesfully", token ,username: emp.username})
    }else{
        res.status(400).json({error: "Invalid Creadentials"})
    }
})

router.post('/checkin', authenticate, async (req,res)=>{
    try {
        // Extract user ID from the authenticated request
        const { _id: employeeId } = req.user;
        const { date, checkInTime } = req.body;
        console.log("this is from checkin",{date, checkInTime});
        // Check if the user has already checked in for the specified date
        const existingAttendance = await Attendance.findOne({
            employeeId,
            date: date
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'User has already checked in for the day' });
        }
        // if not checked in then create new record and save that
        const newAttendance = new Attendance({
            employeeId,
            date: date || new Date(),
            checkInTime: checkInTime || new Date()
        });

        await newAttendance.save();

        res.json({ message: 'Check-in successful', attendance: newAttendance });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

//route to start the break 
router.post('/startbreak', authenticate, async (req, res) => {
    try {
      
        const { _id: employeeId } = req.user;

        // Extract data from the request body
        const { date, breakStartTime } = req.body;
  
        // Find the attendance record for the specified user and date
        const attendance = await Attendance.findOne({
            employeeId,
            date: date
        });

        if (!attendance) {
            // No attendance record found for the user on the specified date
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        if (attendance.checkOutTime) {
            return res.status(400).json({ message: 'User has already checked out for the day so he can not start break' });
        }
        // Check if the user has already started a break for the specified date
        if (attendance.breakTimes.some(breakEntry => !breakEntry.end)) {
            return res.status(400).json({ message: 'User has already started a break' });
        }

        // Add a new break entry with the provided start time
        attendance.breakTimes.push({ start: breakStartTime || new Date() });

    
        await attendance.save();

        res.json({ message: 'Break started successfully', attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/endbreak', authenticate, async (req, res) => {
    try {
    
        const { _id: employeeId } = req.user;
        
        const { date, breakEndTime } = req.body;

        // Find the attendance record for the specified user and date
        const attendance = await Attendance.findOne({
            employeeId,
            date: date || new Date()
        });

        if (!attendance) {
            // No attendance record found for the user on the specified date
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        if (attendance.checkOutTime) {
            return res.status(400).json ({ message: 'User has already checked out for the day so he can not start/end break' });
        }
        // Find the last break entry that doesn't have an end time (i.e., the active break)
        const activeBreak = attendance.breakTimes.find(breakEntry => !breakEntry.end);

        if (!activeBreak) {
            return res.status(400).json({ message: 'No active break found' });
        }

        // Set the end time for the active break
        activeBreak.end = breakEndTime || new Date();

        // Calculate the duration of the break and update totalWorkedHours
        const breakDuration = activeBreak.end - activeBreak.start;
        attendance.totalWorkedHours -= breakDuration;

        await attendance.save();

        res.json({ message: 'Break ended successfully', attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/checkout', authenticate, async (req, res) => {

    try {
        const { _id: employeeId } = req.user;

        const { date, checkOutTime } = req.body;
        console.log("this is from checkout",{date, checkOutTime})
        const attendance = await Attendance.findOne({
            employeeId,
            date: date
        });

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        if (attendance.checkOutTime) {
            return res.status(400).json({ message: 'User has already checked out for the day' });
        }
        
        // Set the check-out time only if provided in the request body
        if (checkOutTime !== undefined) {
            attendance.checkOutTime = checkOutTime;
        } else {
            attendance.checkOutTime = new Date();
        }
        // if (attendance.breakTimes.some(breakEntry => !breakEntry.end)) {
        //     return res.status(400).json({ message: 'User has already started a break' });
        // }
        const checkInTime = attendance.checkInTime || attendance.date;
        const breaksDuration = attendance.breakTimes.reduce((total, breakEntry) => {
            if (breakEntry.start && breakEntry.end) {
                return total + (breakEntry.end - breakEntry.start);
            }
            return total;
        }, 0);
        const totalWorkedHours =
            (attendance.checkOutTime - checkInTime - breaksDuration) / (1000 * 60 * 60); // Convert milliseconds to hours

        // Update totalWorkedHours in the attendance record
        attendance.totalWorkedHours = totalWorkedHours;

        // Save the updated attendance record to the database
        await attendance.save();

        res.json({
            message: 'Checkout successful',
            totalWorkedHours,
            attendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//to get the all data
router.get('/me', authenticate, async (req,res)=>{
    const { _id: employeeId } = req.user;
    try {
        const attendanceData = await Attendance.find({ employeeId });

        if (!attendanceData || attendanceData.length === 0) {
            return res.json({ message: 'No attendance records found for the user', attendance: [] });
        }
        res.status(200).json({ message: 'Attendance data retrieved successfully', attendance: attendanceData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = router