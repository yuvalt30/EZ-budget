const express = require('express')
const BudgetSections = require('../models/BudgetSections')
const sectionTrack = require('../models/SectionTrack')
const router = express.Router()
const helper = require('./helper')


// get general reflection of each section, as sum of its sub sections
router.get('/', async (req, res)=>{
    result = []
    secs = await BudgetSections.getSections()
    await Promise.all(secs.map(async (sec) => {
        trans = await helper.getTransactionsBySecNameAsync(sec)
        divided = helper.divideTransByInOut(trans) // [inArray, outArray]
        incomeExec = helper.generateExecFromTransArray(divided[0])
        outcomeExec = helper.generateExecFromTransArray(divided[1])
        exec = {
            section: sec,
            income: incomeExec,
            outcome: outcomeExec
        }
        result.push(exec)
    }))
    res.send(result)
})

// get reflection of specific section, showing each sub section
router.get('/section', async (req, res)=>{
    try{
    const aSection = await Reflection.find({sectionName: req.query.sectionName})

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