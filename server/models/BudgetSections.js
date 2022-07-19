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
BudgetSectionSchema.static('getSubs', function(aSectionName) { return this.find({ sectionName: aSectionName}, 'subSection isIncome budget' ) });
BudgetSectionSchema.static('getSubsNamesFromArray', function(secsArray) {
    if(secsArray.length == 0)
    return this.aggregate([
        {$sort: {
            subSection: 1
        }},
        { $group : { _id: "$sectionName", subSections: { $push: {subSection: "$subSection", isIncome:"$isIncome", _id:"$_id"}}}}
        , {
            $sort: {
                _id: 1
            }
        }
    ])
    return this.aggregate([
        {$sort: {
            subSection: 1
        }},
        { $match : { "sectionName" : {$in: secsArray}}},
        { $group : { _id: "$sectionName", subSections: { $push: {subSection: "$subSection", isIncome:"$isIncome", _id:"$_id"}}}}
        , {
            $sort: {
                _id: 1
            }
        }
    ])
});

BudgetSectionSchema.static('getSubIdByNames', async function(section, sub, isIncome) { 
    id = await this.find({ sectionName: section, subSection: sub, isIncome: isIncome}, '_id' )
    if (id.length == 0){
        return null
    }
    return id[0]._id
 });
 BudgetSectionSchema.static('getSectionBudget', function(aSectionName) { 
    return this.aggregate([
        {   $match: { "sectionName": aSectionName } },
        { 
            $group: {
                _id: "$isIncome",
                budget: { $sum: "$budget" }
            } 
        },
        // {
        //     $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$subIdDocs", 0 ] }, "$$ROOT" ] } }
        // },
    ])
  });

module.exports = mongoose.model("BudgetSection", BudgetSectionSchema)