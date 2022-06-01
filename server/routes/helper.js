const { response } = require('express')
const BudgetSections = require('../models/BudgetSections')
const Tran = require('../models/Transaction')



async function getTransactionsBySecAndSub(secName, subName){
    return removeNullsFromTrans(await Tran.getTransactionsBySecAndSubWithNulls(secName, subName))
    
}

async function getTransactionsBySecName(secName){
    return removeNullsFromTrans(await Tran.getTransactionsBySecNameWithNulls(secName))
    
}

async function removeNullsFromTrans(transWithNulls){
    ret = []
    transWithNulls.forEach(doc => {
        if(doc.section){
            ret.push(doc)
        }
    })
    return ret
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

module.exports = {getTransactionsBySecAndSub, getTransactionsBySecName, getExecforSecandSub, getExecForSec}