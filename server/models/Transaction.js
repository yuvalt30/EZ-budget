const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema({
    section: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BudgetSection'
    },
    amount : {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

TransactionSchema.static('getTransactionsBySubId', function(subId) { return this.find({ section: subId })});


module.exports = mongoose.model("Transactions", TransactionSchema)