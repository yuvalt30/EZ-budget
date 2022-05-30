const { response } = require('express')
const BudgetSections = require('../models/BudgetSections')
const Tran = require('../models/Transaction')



async function getSections()
{
    try{
         await BudgetSections.find({}).select({sectionName:true}).distinct('sectionName').exec().then(sections => {
        console.log('2\n'+sections)
            return sections
        })}
    catch(err)
    {
            console.log(err)
    }
}


async function getSubs(aSectionName)
{
    try{
        const subs = await BudgetSections.find({sectionName: aSectionName})
            return subs
        }
    catch(err)
    {
            console.log(err)
    }
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

module.exports = {getSubs,getSections, getExecforSecandSub, getExecForSec}