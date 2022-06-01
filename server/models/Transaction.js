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

TransactionSchema.static('getTransactionsBySecAndSubWithNulls', function(secName, subName) {
     return this.find({ }).populate({
            path: 'section',
            match: {subSection: subName, sectionName: secName},
            select: 'isIncome -_id'
        })
     });
TransactionSchema.static('getTransactionsBySubId', function(subId) { return this.find({ section: subId }).populate('section')});

TransactionSchema.static('getTransactionsBySecNameWithNulls', function(secName) { return this.find({}).populate({
    path:'section',
    match: {sectionName: secName},
    select: 'subSection isIncome -_id'
})});


module.exports = mongoose.model("Transactions", TransactionSchema)