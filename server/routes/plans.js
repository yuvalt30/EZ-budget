const express = require('express')
const Plan = require('../models/PlanBudget')
const Sections = require('../models/BudgetSections')
const router = express.Router()
const helper = require('./helper')

router.post('/test', async (req, res)=>{
    console.log(req.body.data)
    res.send(helper.handleCSVBudget(req.body.data))
})

router.get('/sec', async (req,res) => {
    res.send(await helper.getAllSubsBudgetAsync(req.query.year, req.query.sectionName))
})

router.get('/', async (req,res) => {
    res.send(await helper.getAllSecsBudgetAsync(req.query.year))
})

async function createNewBudgetAsync(subId, amount, year){
    try{
        // let sub = await Sections.findById(subId)
        let filter = year ? {section: subId, year: year} : {section: subId}
        update = await Plan.updateOne(
            filter,
            {amount: amount},
            {upsert: true}
        )
        console.log(update)
        return update.matchedCount ? true : false
    } catch(e) {console.log(e);return false}
}

router.put('/:subId-:amount', async (req, res) => {
    if(await createNewBudgetAsync(req.params.subId, req.params.amount, new Date().getFullYear()))
    {
        res.status(201).send()
    } else {res.status(400).send('No such sub section')}
})

router.post('/file', async (req, res) => {
    let inserted=0
    let notExist=0
    let e=0
    await Promise.all(req.body.budgets.map(async budget => {
        secId = await Sections.getSubIdByNames(budget.sectionName, budget.subSection, req.body.isIncome)
        if(secId == null) {notExist+=1}
        else {if (await createNewBudgetAsync(secId, budget.amount, budget.year)) {inserted+=1}
            else {e +=1}}
    }))
    console.log(inserted+" inserted, "+e+" errors, "+notExist+" non existing sections")
    if(inserted){
        res.status(201).send(e ? inserted+" inserted, "+e+" errors, ensure section and sub section exist" : "all "+inserted+" transactions inserted")
    } else res.status(400).send("all "+e+" insertions failed, ensure section and sub section exist")
})

module.exports = router