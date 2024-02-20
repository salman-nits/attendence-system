const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username : {
        type : String,
        unique: true
    },
    email :  {
        type : String,
        unique: true
    },
    password : String
})

const employeeSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String
})

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    date: String,
    checkInTime: Date,
    checkOutTime: Date,
    breakTimes: [{
        start: Date,
        end: Date
    }],
    totalWorkedHours: {
        type: Number,
        default: 0
    }
});

const Admin = mongoose.model('Admin', adminSchema);
const Employee = mongoose.model('Employee', employeeSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = {
    Admin,
    Employee,
    Attendance
}