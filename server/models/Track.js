const mongoose = require("mongoose")

const PlanSchema = new mongoose.Schema({
    section: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BudgetSection'
    },
    monthlyAmount : {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model("Plan", PlanSchema)