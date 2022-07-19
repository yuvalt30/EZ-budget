const express = require('express')
const Plan = require('../models/PlanBudget')
const Sections = require('../models/BudgetSections')
const router = express.Router()
const helper = require('./helper')


router.get('/sec', async (req,res) => {
    res.send(await helper.getAllSubsBudgetAsync(req.query.year, req.query.sectionName))
})

router.get('/', async (req,res) => {
    res.send(await helper.getAllSecsBudgetAsync(req.query.year))
})

async function createNewBudgetAsync(subId, amount, year){
    try{
        // let sub = await Sections.findById(subId)
        update = await Plan.updateOne(
            {section: subId, year: year}
            ,
            {amount: amount}
        )
    } catch(e) {return false}
    return update.matchedCount ? true : false
}

router.put('/:subId-:amount', async (req, res) => {
    if(await createNewBudgetAsync(req.params.subId, req.params.amount), new Date().getFullYear())
    {
        res.status(201).send()
    } else {res.status(500).send('No such sub section')}
})

router.post('/file', async (req, res) => {
    let inserted=0
    let notExist=0
    let e=0
    await Promise.all(req.body.budgets.map(async budget => {
        secId = await Sections.getSubIdByNames(budget.sectionName, budget.subSection, req.body.isIncome)
        if(secId == null) {notExist+=1}
        else {if (await createNewBudgetAsync(secId, budget.amount/*, budget.year*/)) {inserted+=1}
            else {e +=1}}
    }))
    console.log(inserted+" inserted, "+e+" errors, "+notExist+" non existing sections")
    if(inserted){
        res.status(201).send(e ? inserted+" inserted, "+e+" errors, ensure section and sub section exist" : "all "+inserted+" transactions inserted")
    } else res.status(400).send("all "+e+" insertions failed, ensure section and sub section exist")
})

module.exports = router