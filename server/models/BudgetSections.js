const mongoose = require("mongoose")

const BudgetSectionSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        required: true,
    },
    subSection: { 
        type: String, 
        required : true,
    },
    isIncome: {
        type: Boolean,
        required: true
    }
});

BudgetSectionSchema.static('getSections', function() { return this.find({ }).select({sectionName:true}).distinct('sectionName') });
BudgetSectionSchema.static('getSubs', function(aSectionName) { return this.find({ sectionName: aSectionName}, 'subSection isIncome' ) });

module.exports = mongoose.model("BudgetSection", BudgetSectionSchema)