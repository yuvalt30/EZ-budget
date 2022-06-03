const express = require('express')
const BudgetSections = require('../models/BudgetSections')
const router = express.Router()
var bodyParser = require('body-parser')

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// create application/json parser
var jsonParser = bodyParser.json()

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
    console.log(req.body+" , "+req.body.subSection)
    update = await BudgetSections.updateOne({
        sectionName: req.body.sectionName, subSection: req.body.subSection
        },  
        {
        sectionName: req.body.sectionName, subSection: req.body.subSections, isIncome: req.body.isIncome
        },
        {upsert: true})
    if(update.upsertedCount){
        res.send(update.upsertedCount+" section added")
    } else {
        res.send("No section added, requested section already exists")
    }
})

// TODO: create new sections from CSV file

module.exports = router