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

router.put('/:subId-:amount', async (req, res) => {
    inserted = 0; er = 0;
    try{
        subId = req.params.subId
        year = new Date().getFullYear()
        let sub = await Sections.findById(subId)
        if(sub == null) {
            res.status(400).send('No such sub section')
            return;
        }
        update = await Plan.updateOne(
            {section: subId, year: year}
            ,
            {section: subId, year: year, amount: req.params.amount}
            ,
            {upsert: true, runValidators: true})
        res.status(200).send('updates:'+ update.modifiedCount)
    } catch(e) {res.status(500).send(e)}
})

module.exports = router