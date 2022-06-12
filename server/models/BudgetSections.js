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
    },
    budget: {
        type: Number,
        default: 0
    }
});

BudgetSectionSchema.static('getSections', function() { return this.find({ }).select({sectionName:true}).distinct('sectionName') });
BudgetSectionSchema.static('getSubs', function(aSectionName) { return this.find({ sectionName: aSectionName}, 'subSection isIncome budget -_id' ) });
BudgetSectionSchema.static('getSubsNamesFromArray', function(secsArray) { 
    return this.aggregate([
        { $match : { "sectionName" : {$in: secsArray}}},
        { $group : { _id: "$sectionName", subSections: { $push: "$subSection"}}}
    ])
});

BudgetSectionSchema.static('getSubIdByNames', async function(section, sub) { 
    id = await this.find({ sectionName: section, subSection: sub}, '_id' )
    if (id.length == 0){
        return null
    }
    return id[0]._id
 });
 BudgetSectionSchema.static('getSectionBudget', function(aSectionName) { 
    this.aggregate([
        { $match: { ectionName: aSectionName } },
        { $group: { _id: null, budget: { $sum: "$budget" } } }
    ])
  });

module.exports = mongoose.model("BudgetSection", BudgetSectionSchema)