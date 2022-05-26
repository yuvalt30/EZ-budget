const mongoose = require("mongoose")

const BudgetPlanSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        required: true,
    },
    monthly: {
        type: Number,
        required : true,
    },
    isRevenue: {
        type: Boolean,
        required : true,
    },
});


module.exports = mongoose.model("Budget", BudgetSchema)