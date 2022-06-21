const Tran = require('../models/Transaction')

function divideTransByInOut(trans){
    ret = [[],[]] // income, outcome
    trans.forEach(tran => ret[tran.section.isIncome ? 0 : 1].push(tran))
    return ret
}

function generateExecFromTransArray(trans, startMonth){
    exec = [0,0,0,0,0,0,0,0,0,0,0,0,]
    console.log(startMonth)
    trans.forEach(tran => {
        let idx = tran.date.getMonth() - startMonth >= 0 ? tran.date.getMonth() - startMonth : tran.date.getMonth() - startMonth + 12
        exec[idx] += tran.amount
    })
    return exec
}

async function getSecTransBySubsAsync(secName, begin, end){
    return await Tran.aggregate([
        { $group : { _id: "$section", trans: { $push:
            {
                $cond:[
                  { $and: [ {$gt: ["$date", begin] }, {$lt: ["$date", end] } ] },
                  { amount: "$amount", date: "$date"},
                  "$$REMOVE"
              ]
            }
         }}},
         { $lookup: {
             from: "budgetsections",
             localField: "_id",
             foreignField: "_id",
             as: "subIdDocs"
         }},
         { $match: {
            'subIdDocs': { $elemMatch: { sectionName : secName}},
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

module.exports = {generateExecFromTransArray,
                divideTransByInOut,getSecTransBySubsAsync,monthDiff,
                }