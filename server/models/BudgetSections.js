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
BudgetSectionSchema.static('getSubIdByNames', async function(section, sub) { 
    id = await this.find({ sectionName: section, subSection: sub}, '_id' )
    if (id.length == 0){
        return null
    }
    return id[0]._id
 });

module.exports = mongoose.model("BudgetSection", BudgetSectionSchema)