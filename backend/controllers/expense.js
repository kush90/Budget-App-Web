const Expense = require('../models/expense');
const mongoose = require('mongoose')

const create = async (req, res) => {
    const { name, amount, budgetId } = req.body;
    let emptyFields = []

    if (!name) {
        emptyFields.push('name')
    }
    if (!amount) {
        emptyFields.push('amount')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }

    try {
        const userId = req.user._id
        const expense = await Expense.create({ name, amount, budgetId, "userId": userId });
        if (!expense) {
            return res.status(404).json({ error: 'No such expense' })
        }
        res.status(200).json({ data: expense, message: 'Expense is successfully created.' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}
const update = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such expense' })
        }

        const expense = await Expense.findOneAndUpdate({ _id: id }, {
            ...req.body
        }, { new: true });

        if (!expense) {
            return res.status(404).json({ error: 'No such expense' })
        }

        res.status(200).json({ data: expense, message: 'Expense is successfully updated.' })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }

}

// get all expenses and  has option to filter by name and createdAt
const getAll = async (req, res) => {
    try {
        const userId = req.user._id;
        let query;
        if (Object.keys(req.query).length !== 0) {

            query = {
                userId: userId
            };
            
            // Check if req.query.search is present and not empty
            if (req.query.search) {
                query.name = { '$regex': req.query.search, '$options': 'i' };
            }
            
            // Check if req.query.month is present and not empty
            if (req.query.month) {
                query.$expr = {
                    $eq: [
                        { $month: '$createdAt' },
                        +req.query.month
                    ]
                };
            }
        }
        else {
            query = {
                userId: userId,
            }
        }
        const expenses = await Expense.find(query).sort({ createdAt: -1 }).populate('budgetId');
        res.status(200).json({ data: expenses })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const get = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such expense' })
        }
        const expense = await Expense.findById(id).populate('budgetId');
        if (!expense) {
            return res.status(404).json({ error: 'No such expense' })
        }
        res.status(200).json({ data: expense })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const remove = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such expense' })
        }
        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).json({ error: 'No such expense' })
        }
        res.status(200).json({ message: "Expense is successfully deleted" });
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const getByBudgetId = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such expense related to this budget id' })
        }
        const expense = await Expense.find({ budgetId: id }).populate('budgetId');
        if (!expense) {
            return res.status(404).json({ error: 'No such expense related to this budget id' })
        }
        res.status(200).json({ data: expense })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}
module.exports = { create, update, getAll, get, remove, getByBudgetId };