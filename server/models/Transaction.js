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
        default: Date.now,
    },
    description: {
        type: String
    }
});

// TransactionSchema.static('getTransactionsBySecAndSubAsync', async function(secName, subName, year) { // TODO: redundunt?
//     if(year){
//         trans = await this.find({ }).populate({
//             path: 'section',
//             match: {subSection: subName, sectionName: secName, date : {
//                 $gte: new Date(year, 0),
//                 $lt: new Date(year, 11, 31, 23, 59)
//             }},
//         })
//     }else{
//         trans = await this.find({ }).populate({
//             path: 'section',
//             match: {subSection: subName, sectionName: secName},
//         })
//     }
//     let ret = []
//     trans.forEach(tran => {
//         if(tran.section){
//             ret.push(tran)
//         }
//     });
//     return ret
//      });

TransactionSchema.static('getTransactionsBySubIdAsync', async function(subId, startDate, endDate) { 
    if(startDate && endDate){
        return await this.find({ section: subId, date: {
            $gte: startDate,
            $lt: endDate
        }}).populate('section')
    }else{
        return await this.find({ section: subId }).sort({date:-1}).populate('section')
    }
});

TransactionSchema.static('getTransactionsBySecNameAsync', async function(secName, startDate, endDate) {
    if(startDate && endDate){
        trans = await this.find({ date: {
            $gte: startDate,
            $lt: endDate 
        }}).populate({
            path:'section',
            match: {sectionName: secName},
        })
    } else {
        trans =  await this.find({}).sort({date:-1}).populate({
            path:'section',
            match: {sectionName: secName},
        })
    }
    let ret = []
    trans.forEach(tran => {
        if(tran.section){
            ret.push(tran)
        }
    });
    return ret
});


module.exports = mongoose.model("Transactions", TransactionSchema)