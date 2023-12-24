const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Budget"
    },
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    }
},
    {
        timestamps: true
    }
);

module.exports =  mongoose.model('Expense',expenseSchema)