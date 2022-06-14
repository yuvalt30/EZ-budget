const express = require('express')
const BudgetSections = require('../models/BudgetSections')
// const sectionTrack = require('../models/SectionTrack')
// const subTrack = require('../models/SubTrack')
const router = express.Router()
const helper = require('./helper')
const Tran = require('../models/Transaction')

router.get('/test/:name', async (req, res)=>{
    res.send(await helper.getSecTransBySubsAsync(req.params.name))
})


// get general current year reflection of all sections, each section as sum of its sub sections
router.get('/', async (req, res)=>{
    result = []
    secs = await BudgetSections.getSections()
    await Promise.all(secs.map(async (sec) => {
        let trans = await Tran.getTransactionsBySecNameAsync(sec)
        let divided = helper.divideTransByInOut(trans) // [inArray, outArray]
        let plan = await BudgetSections.getSectionBudget(sec)
        let exec = {
            section: sec,
            plan: plan
        }
        if(plan.find(x => x._id === true))
            exec.income = helper.generateExecFromTransArray(divided[0])
        if(plan.find(x => x._id === false))
            exec.outcome = helper.generateExecFromTransArray(divided[1])
        result.push(exec)
    }))
    res.send(result)
})

// get  year reflection for given section, showing each of its subs
router.get('/:secName', async (req, res)=>{
    try{
        result = []
        transBySubs = await helper.getSecTransBySubsAsync(req.params.secName)
        transBySubs.forEach(sub => {
            let exec = {
                subSection: sub.subSection,
                plan: sub.budget,
                data: helper.generateExecFromTransArray(sub.trans)
            }
            result.push(exec)
        })
        res.send(result)
    } catch(e) { res.status(500).send(e) }
})

async function getTrackForSubAsync(subId, year){
    try{
        const trans = await Tran.getTransactionsBySubIdAsync(subId, year)
        exec = helper.generateExecFromTransArray(trans)
        // newExec = new SubTrack({})
        res.send(exec)
        }catch(err){
            console.log(err)
            res.status(500).send(err)
        }
}

// create new section
router.post('/', async (req, res)=>{
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

module.exports = router