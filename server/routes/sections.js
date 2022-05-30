const express = require('express')
const BudgetSections = require('../models/BudgetSections')
const router = express.Router()
const helper = require('./helper')

// get all sections, no subs
router.get('/', async (req, res)=>{
    const allSections = await BudgetSections.find({}).aggregate([{$group: {
        _id: sectionName
    }}]).exec()
    res.send(sectionsNames)
})

// get specific section's subs
router.get('/subs', async (req, res)=>{
    subs = await helper.getSubs(req.query.sectionName)
    res.send(subs)
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