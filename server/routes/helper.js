const { response } = require('express')
const BudgetSections = require('../models/BudgetSections')
const Tran = require('../models/Transaction')



async function getTransactionsBySecAndSubAsync(secName, subName){
    return removeNullsFromTrans(await Tran.getTransactionsBySecAndSubWithNulls(secName, subName))
    
}

async function getTransactionsBySecNameAsync(secName){
    return removeNullsFromTrans(await Tran.getTransactionsBySecNameWithNulls(secName))
    
}

function removeNullsFromTrans(transWithNulls){
    ret = []
    transWithNulls.forEach(doc => {
        if(doc.section){
            ret.push(doc)
        }
    })
    return ret
}

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

async function getExecForSec(sec){
    trans = await Tran.find({sectionName: sec})
    console.log(trans)
    var income = [0,0,0,0,0,0,0,0,0,0,0,0,]
    var outcome = [0,0,0,0,0,0,0,0,0,0,0,0,]
    trans.forEach(tran => {
        if(tran.isIncome){
            income[tran.date.getMonth] += tran.amount
        } else {
            outcome[tran.date.getMonth] += tran.amount
        }
    })
    return {name: sec, income: income, outcome: outcome}
}

async function getExecforSecandSub(sec, sub){

}

module.exports = {generateExecFromTransArray,divideTransByInOut, getTransactionsBySecAndSubAsync,
                  getTransactionsBySecNameAsync, getExecforSecandSub, getExecForSec}