const express = require('express')
const BudgetSections = require('../models/BudgetSections')
const router = express.Router()

// get all sections, no subs
router.get('/', async (req, res)=>{
    sectionsNames = await BudgetSections.getSections()
    res.send(sectionsNames)
})

// get specific section's subs
router.get('/subs', async (req, res)=>{
    subs = await BudgetSections.getSubs(req.query.sectionName)
    res.send(subs)
})

// create new section
router.post('/',  async (req, res)=>{
    update = await BudgetSections.updateOne({
        sectionName: req.body.sectionName, subSection: req.body.subSection
        },  
        {
        sectionName: req.body.sectionName, subSection: req.body.subSections, isIncome: req.body.isIncome
        },
        {upsert: true})
    if(update.upsertedCount){
        res.status(201).send(update.upsertedCount+" section added")
    } else {
        res.send("No section added, requested section already exists")
    }
})

// TODO: create new sections from CSV file

module.exports = router