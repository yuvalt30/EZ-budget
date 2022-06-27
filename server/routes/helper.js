const Tran = require('../models/Transaction')

function divideTransByInOut(trans){
    ret = [[],[]] // income, outcome
    trans.forEach(tran => ret[tran.section.isIncome ? 0 : 1].push(tran))
    return ret
}

function generateExecFromTransArray(trans, startMonth){
    exec = Array(12).fill(0)
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
         { $project: { subIdDocs: 0, sectionName: 0, __v: 0 } }
     ])
}

async function getAllTransBySecsAsync(begin, end){
    return await Tran.aggregate([
        [
            [{$lookup: {
                from: 'budgetsections',
                localField: 'section',
                foreignField: '_id',
                as: 'subIdDocs'
               }}, {$unwind: {
                path: '$subIdDocs'
               }}, {$group: {
                _id: '$subIdDocs.sectionName',
                trans: {
                 $push: {
                  amount: '$amount',
                  date: '$date'
                 }
                }
               }}]
          ]
     ])
}

function handleTranCSV(str) {
    result = []
    stripped = str.split("\'").join('') // strip
    stripped.split('\r\n').forEach(line => {
        words = line.split(',')
        if(words[0])
            result.push(
                {
                    description: words[0].trim(),
                    amount: words[1].trim(),
                    date: words[2].trim(),
                    subSection: words[4].trim(),
                    sectionName: words[3].trim(),
                }
            ) 
    });
    console.log(result)
}

function handleCSV(str) {
    result = {
        incomes: [],
        outcomes: []
    }
    stripped = str.split("\'").join('') // strip
    stripped = stripped.split('&')  // divide income & outcome
    // incomes
    stripped[0].split('\r\n').forEach(line => {
        words = line.split(',')
        if(words[0])
            result.incomes.push(
                {
                    sectionName: words[0],
                    subSections: words.slice(1,words.length)
                }
            ) 
    });
    //outcomes
    stripped[1].split('\r\n').forEach(line => {
        words = line.split(',')
        if(words[0])
            result.outcomes.push(
                {
                    sectionName: words[0],
                    subSections: words.slice(1,words.length)
                }
            )
    });
    console.log(result)
}

function monthDiff(startDate, endDate) {
    return (
      endDate.getMonth() -
      startDate.getMonth() +
      12 * (endDate.getFullYear() - startDate.getFullYear())
    );
  }

module.exports = {generateExecFromTransArray,
                divideTransByInOut,getSecTransBySubsAsync,monthDiff,handleCSV,handleTranCSV,
                }