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
router.post('/', async (req, res)=>{
    section = req.body.sectionName
    subs = req.body.subSections
    console.log(section +'\n'+ subs+' '+subs[0].name)
    dups=0
    inserted=0
    await Promise.all(subs.map(async sub => {
        console.log(sub.name)
        update = await BudgetSections.updateOne({
            sectionName: section, subSection: sub.name
            },  
            {
                sectionName: section, subSection: sub.name, isIncome: sub.isIncome
            },
            {upsert: true})
        console.log(update)
        if(update.upsertedCount){
            inserted += update.upsertedCount
        } else {
            dups += 1
        }        
    }));
    msg = dups ? inserted+" inserted, "+dups+" sections already exist" : "all "+subs.length+" sections added" 
    res.status(201).send(msg)

})

// TODO: create new sections from CSV file

module.exports = router