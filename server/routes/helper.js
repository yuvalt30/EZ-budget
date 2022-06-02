const { response } = require('express')
const BudgetSections = require('../models/BudgetSections')
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


module.exports = {generateExecFromTransArray,divideTransByInOut,}