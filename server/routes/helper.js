const Tran = require('../models/Transaction')

function divideTransByInOut(trans){
    ret = [[],[]] // income, outcome
    trans.forEach(tran => ret[tran.section.isIncome ? 0 : 1].push(tran))
    return ret
}

function generateExecFromTransArray(trans){
    exec = [0,0,0,0,0,0,0,0,0,0,0,0,]
    trans.forEach(tran => {
        exec[tran.date.getMonth()] += tran.amount
    })
    return exec
}

async function getSecTransBySubsAsync(secName){
    return await Tran.aggregate([
        { $group : { _id: "$section", trans: { $push: {amount: "$amount", date: "$date"
         }}}},
         { $lookup: {
             from: "budgetsections",
             localField: "_id",
             foreignField: "_id",
             as: "subIdDocs"
         }},
         { $match: {
             'subIdDocs': { $elemMatch: { sectionName : secName}},
             //'date': { $gte: new ISODate("2014-01-01"), $lt: new ISODate("2015-01-01") }
             }
         },
         {
             $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$subIdDocs", 0 ] }, "$$ROOT" ] } }
         },
         { $project: { subIdDocs: 0, sectionName: 0, _id: 0, __v: 0 } }
     ])
}

function monthDiff(startDate, endDate) {
    return (
      endDate.getMonth() -
      startDate.getMonth() +
      12 * (endDate.getFullYear() - startDate.getFullYear())
    );
  }

  async function transDateRangeSubAsync(subId) {
    oldest = (await Tran.findOne({ section: subId}, {}, { sort: { 'date' : 1}})).date
    newest = (await Tran.findOne({ section: subId}, {}, { sort: { 'date' : -1}})).date
    return [oldest, newest, monthDiff(oldest, newest)]
}

async function transDateRangeSecAsync(secName) {
    trans = await Tran.getTransactionsBySecNameAsync(secName).sort((a,b) => monthDiff(a.date, b.date))
    newest = (await Tran.findOne({ section: subId}, {}, { sort: { 'date' : -1}})).date
    return [oldest, newest, monthDiff(oldest, newest)]
}

module.exports = {generateExecFromTransArray,
                divideTransByInOut,getSecTransBySubsAsync,monthDiff,
                transDateRangeSubAsync,transDateRangeSecAsync,}