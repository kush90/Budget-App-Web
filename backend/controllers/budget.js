const Budget = require('../models/budget');
const mongoose = require('mongoose')
const User = require('../models/user');
const Expense = require('../models/expense');
const expense = require('../models/expense');

const create = async (req, res) => {
    const { name, amount, color } = req.body;
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
        const budget = await Budget.create({ name, amount, color, "userId": userId });
        if (!budget) {
            return res.status(404).json({ error: 'No such budget' })
        }
        res.status(200).json({ data: budget, message: 'Budget is successfully created.' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}
const update = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such budget' })
        }

        const budget = await Budget.findOneAndUpdate({ _id: id }, {
            ...req.body
        }, { new: true });

        if (!budget) {
            return res.status(404).json({ error: 'No such budget' })
        }

        res.status(200).json({ data: budget, message: 'Budget is successfully updated.' })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }

}

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
        }
        else {
            query = {
                userId: userId,
            }
        }

        const budgets = await Budget.find(query).sort({ createdAt: -1 }).lean().exec();
        for (let i = 0; i < budgets.length; i++) {

            budgets[i]['expenses'] = await Expense.find({ budgetId: budgets[i]._id, userId: userId });
        }
        res.status(200).json({ data: budgets })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const get = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such budget' })
        }
        let budget = await Budget.findById(id).lean().exec();
        if (!budget) {
            return res.status(404).json({ error: 'No such budget' })
        }
        const expenses = await Expense.find({ budgetId: id, userId: userId });
        budget["expenses"] = expenses
        res.status(200).json({ data: budget })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const remove = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such budget' })
        }
        const budget = await Budget.findByIdAndDelete(id);
        if (!budget) {
            return res.status(404).json({ error: 'No such budget' })
        }
        const deleteQuery = Expense.deleteMany({ budgetId: id });

        deleteQuery.exec()
            .then((result) => {
                console.log(`Deleted ${result.deletedCount} records successfully`);
                res.status(200).json({ message: "Budget is successfully deleted" });
            })
            .catch((err) => {
                console.error('Error deleting records:', err);
            });


    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

// pie chartData to get budgets and associated expenses and total expenses amount 
const totalExpenses = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await Expense.aggregate(
            [
                { $match: { userId: userId,
                    $expr: {
                    $cond: {
                        if: { $eq: [req.query.month, undefined] },
                        then: {},
                        else: { $eq: [{ $month: '$createdAt' }, parseInt(req.query.month)] }
                      }
                    }
                } },
                {
                    $group: {
                        _id: '$budgetId',
                        value: { $sum: '$amount' },
                        totalExpenses: { $sum: 1 },
                    },
                },
                {
                    $lookup: {
                        from: 'budgets',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'budgetDetails',
                    },
                },
                {
                    $unwind: '$budgetDetails',
                },
                {
                    $project: {
                        _id: null,
                        value: 1,
                        name: '$budgetDetails.name',
                        color: '$budgetDetails.color',
                        totalBudget: '$budgetDetails.amount',
                        totalExpenses: 1
                    },
                },
            ]
        );
        res.status(200).json({ data: result })
    }
    catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const budgetExpenses = async (req, res) => {
    try {
        const userId = req.user._id;
        let result = await Expense.aggregate([
            { $match: { userId: userId } },
            {

                $group: {
                    _id: '$budgetId',
                    totalExpenses: { $sum: '$amount' },
                    expenses: { $push: '$$ROOT' },
                },
            },
            {
                $lookup: {
                    from: 'budgets',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'budget',
                },
            },
            {
                $unwind: '$budget',
            },
            {
                $project: {
                    _id: 0,
                    budget: {
                        _id: '$budget._id',
                        name: '$budget.name',
                        amount: '$budget.amount',
                    },
                    totalExpenses: 1,
                    expenses: 1,
                },
            },
        ]);
        res.status(200).json({ data: result })
    }
    catch (error) {
        res.status(400).json({ "error": error.message })
    }
}
module.exports = { create, update, getAll, get, remove, totalExpenses, budgetExpenses };