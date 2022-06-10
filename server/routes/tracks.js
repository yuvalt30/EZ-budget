const express = require('express')
const BudgetSections = require('../models/BudgetSections')
const sectionTrack = require('../models/SectionTrack')
const subTrack = require('../models/SubTrack')
const router = express.Router()
const helper = require('./helper')
const Tran = require('../models/Transaction')
const SectionTrack = require('../models/SectionTrack')
const SubTrack = require('../models/SubTrack')

router.get('/test', async (req, res)=>{
    res.send(await Tran.getTransactionsBySubIdAsync('6295090066b45d3af17cdc97', req.query.year))
})


// get general  year reflection of all sections, each section as sum of its sub sections
router.get('/', async (req, res)=>{
    result = []
    secs = await BudgetSections.getSections()
    await Promise.all(secs.map(async (sec) => {
        trans = await Tran.getTransactionsBySecNameAsync(sec, req.query.year)
        divided = helper.divideTransByInOut(trans) // [inArray, outArray]
        incomeExec = helper.generateExecFromTransArray(divided[0])
        outcomeExec = helper.generateExecFromTransArray(divided[1])
        exec = {
            section: sec,
            income: incomeExec,
            outcome: outcomeExec
        }
        newExec = new SectionTrack({})
        result.push(exec)
    }))
    res.send(result)
})

// get  year reflection for given section, showing each of its subs
router.get('/:subId', async (req, res)=>{
    try{
    const subReflection = await getTrackForSub(req.params.subId, req.query.year)
    res.send(subReflection)
    } catch(e) {
        res.status(500).send(e)
    }
    
})

async function getTrackForSub(subId, year){
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