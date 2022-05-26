const mongoose = require("mongoose")

const BudgetSectionSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        required: true,
    },
    subSections: {
        type: Array,
        required : true,
    },
});

module.exports = mongoose.model("BudgetSection", BudgetSectionSchema)