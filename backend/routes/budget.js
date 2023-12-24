const express = require('express');
const { create,update,getAll,get,remove,totalExpenses,budgetExpenses } = require('../controllers/budget');
const auth = require('../middleware/auth')

const budget = express.Router();
budget.use(auth);
budget.post('/create',create);
budget.patch('/update/:id', update)
budget.get('/getAll/',getAll);
budget.get('/get/:id',get);
budget.delete('/delete/:id',remove);
budget.get('/chartData',totalExpenses);
budget.get('/expenses',budgetExpenses)
module.exports = budget;