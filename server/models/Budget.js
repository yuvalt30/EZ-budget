const mongoose = require("mongoose")

const BudgetSchema = new mongoose.Schema({
    instName: {
        type: String,
        required: true,
    },
    instCFO: {
        type: String,
        required : true,
    },
    amount: {
        type: Number,
        required : true,
    },
});

const aBudget = mongoose.model("Budget", BudgetSchema)
module.exports = aBudget