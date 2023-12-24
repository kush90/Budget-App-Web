const express = require('express');
const { create,update,getAll,get,remove, getByBudgetId } = require('../controllers/expense');
const auth = require('../middleware/auth')

const expense = express.Router();
expense.use(auth);
expense.post('/create',create);
expense.patch('/update/:id', update)
expense.get('/getAll/',getAll);
expense.get('/get/:id',get);
expense.delete('/delete/:id',remove);
expense.get('/getByBudgetId/:id',getByBudgetId)
module.exports = expense;