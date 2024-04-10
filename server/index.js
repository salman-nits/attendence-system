const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const app = express()
const adminRouter = require('./src/routes/adminRoutes')
const employeeRouter = require('./src/routes/employeeRoutes')
dotenv.config();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;
const dbUrl = process.env.DATABASE_URL;

//admin apis
app.use('/api/admin/v1',adminRouter);
app.use('/api/emp/v1', employeeRouter);

app.listen(port, '0.0.0.0',() => {
  
  console.log(`Server is running on http://0.0.0.0:${port}`)
})

mongoose.connect(`${dbUrl}`);