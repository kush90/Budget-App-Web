require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');

const userRoutes = require('./routes/user')
const budgetRoutes =  require('./routes/budget')
const expenseRoutes =  require('./routes/expense')
const auth = require('./middleware/auth');

// express app
const app = express()

// middleware
app.use(express.json())

app.use(cors());

app.use('/test/welcome',auth,(req,res)=>{
  res.status(200).json({message:"hi"})
});


// routes
app.use('/api/user', userRoutes);
app.use('/api/budget',budgetRoutes);
app.use('/api/expense',expenseRoutes)

// connect to db
mongoose.connect(process.env.MONGO_ONLINE_URL)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })