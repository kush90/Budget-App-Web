const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    color: {
        type:String
    }
},
    {
        timestamps: true
    }
);
budgetSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports =  mongoose.model('Budget',budgetSchema)