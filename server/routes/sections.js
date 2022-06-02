const express = require('express')
const BudgetSections = require('../models/BudgetSections')
const router = express.Router()
const helper = require('./helper')

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
router.post('/', async (req, res)=>{
    const newSection = new BudgetSections({sectionName: req.body.sectionName, subSections: req.body.subSections, isIncome: req.body.isIncome});
    try{
        await newSection.save();
        res.send("inserted 1/1 sections")
    } catch(err){
        console.log(err)
    }
})

// TODO: create new sections from CSV file

module.exports = router