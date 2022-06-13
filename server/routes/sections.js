const express = require('express')
const user = require('./users')
const BudgetSections = require('../models/BudgetSections')
const router = express.Router()


// get all sections, no subs
router.get('/names', async (req, res)=>{
    sectionsNames = await BudgetSections.getSections()
    res.send(sectionsNames)
})

// get all sections, WITH subs
router.get('/', async (req, res)=>{
    res.send(await BudgetSections.getSubsNamesFromArray([]))
})

// get specific section's subs
router.get('/:section', async (req, res)=>{
    subs = await BudgetSections.getSubs(req.params.section)
    res.send(subs)
})

router.delete('/', async (req, res) => {
    
    secsNames = req.body.sectionsNames
    subs = req.body.subIds
    try{
        await Promise.all(secsNames.map(async sec => {
            await BudgetSections.deleteMany({sectionName: sec})
        }))
        await Promise.all(subs.map(async sub => {
            await BudgetSections.findByIdAndDelete(sub)
        }))
        res.status(200).send()
    } catch(e) {
        res.status(500).send(e)
    }
})

async function createNewSection(section, subs, isIncome) {
    inserted=0
    dups=0
    await Promise.all(subs.map(async sub => {
        update = await BudgetSections.updateOne({
            sectionName: section, subSection: sub
            },  
            {
                sectionName: section, subSection: sub, isIncome: isIncome
            },
            {upsert: true})
        console.log(update)
        if(update.upsertedCount) {inserted += 1}
        else {dups += 1}       
    }));
    return [inserted,dups]
}

// create new section, manually or from CSV file
router.post('/', async (req, res)=>{
    created=0
    dup=0
    if(req.body.incomes)
        await Promise.all(req.body.incomes.map(async incomeSection => {
            result = await createNewSection(incomeSection.sectionName, incomeSection.subSections, true)
            created+=result[0]
            dup+=result[1]
        }))
    if(req.body.outcomes)
        await Promise.all(req.body.outcomes.map(async outcomeSection => {
            result = await createNewSection(outcomeSection.sectionName, outcomeSection.subSections, false)
            created+=result[0]
            dup+=result[1]
        }))
    res.status(201).send(/*created+" section were created, "+dups+" already existed"*/)

})

module.exports = router