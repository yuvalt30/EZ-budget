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
BudgetSectionSchema.static('getSubs', function(aSectionName) { return this.find({ sectionName: aSectionName}) });


// BudgetSectionSchema.statics.getSections = function getSections() {
//     return BudgetSectionSchema.find({}).select({sectionName:true}).distinct('sectionName');
// }

// BudgetSectionSchema.statics.getSections = function() {
//     return new Promise((resolve, reject) => {
//       this.find({}, sectionName, (err, docs) => {
//         if(err) {
//           console.error(err)
//           return reject(err)
//         }
        
//         resolve(docs)
//       })
//     })
//   }

module.exports = mongoose.model("BudgetSection", BudgetSectionSchema)