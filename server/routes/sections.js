const express = require('express')
const BudgetSections = require('../models/BudgetSections')
const router = express.Router()

// get all sections, no subs
router.get('/', async (req, res)=>{
    const allSections = await BudgetSections.find({})
    sectionsNames = []
    allSections.forEach(section => sectionsNames.push(section.sectionName))
    res.send(sectionsNames)
})

// get specific section's subs
router.get('/subs', async (req, res)=>{
    try{
    const aSection = await BudgetSections.find({sectionName: req.query.sectionName}).lean()

    res.send(aSection[0].subSections)
    }catch(err){
        res.send(err)
        console.log(err)
    }
})

// create new section
router.post('/', async (req, res)=>{
    const newSection = new BudgetSections({sectionName: req.body.sectionName, subSections: req.body.subSections});
    try{
        await newSection.save();
        res.send("inserted data")
    } catch(err){
        console.log(err)
    }
})

module.exports = router