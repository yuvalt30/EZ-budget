const mongoose = require("mongoose")

const PlanSchema = new mongoose.Schema({
    section: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BudgetSection'
    },
    amount : {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        default: new Date().getFullYear(),
        required: true
    }
});

module.exports = mongoose.model("Plans", PlanSchema)