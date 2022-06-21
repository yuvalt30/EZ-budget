const express = require('express')
const BudgetSections = require('../models/BudgetSections')
// const sectionTrack = require('../models/SectionTrack')
// const subTrack = require('../models/SubTrack')
const router = express.Router()
const helper = require('./helper')
const Tran = require('../models/Transaction')

router.get('/test/:name', async (req, res)=>{
    res.send(await helper.transDateRange(req.params.name))
})

router.get('/past', async (req, res) => {
    sectionName = req.query.sectionName
    subId = req.query.subId
    if(subId){
        trans = await Tran.getTransactionsBySubIdAsync(subId)
        begin = req.query.begin ? new Date(req.query.begin) : trans[trans.length-1].date
        end = req.query.end ? new Date(req.query.end) : trans[0].date

        past = new Array(helper.monthDiff(begin,end)+1).fill(0)
        trans.forEach(tran => {
            if(tran.date >= begin && tran.date <= end)
                past[helper.monthDiff(begin, tran.date)] += tran.amount
        });
        res.send(past)
        return
    }
    if(sectionName){
        trans = await Tran.getTransactionsBySecNameAsync(sectionName) // sorted
        // trans[0] - newest, trans[trans.length-1] - oldest
        begin = req.query.begin ? new Date(req.query.begin) : trans[trans.length-1].date
        end = req.query.end ? new Date(req.query.end) : trans[0].date
        range = helper.monthDiff(begin,end)+1
        if(range < 1) {
            res.status(400).send(" Begin date must be earlier than End date")
        }
        past = new Array(range).fill(0)
        trans.forEach(tran => {
            if(tran.date >= begin && tran.date <= end)
                past[helper.monthDiff(begin, tran.date)] += tran.amount
        });
        res.send(past)
        return
    }
    res.status(400).send()   
})

// get general current year reflection of all sections, each section as sum of its sub sections
router.get('/', async (req, res)=>{
    result = { income: [], outcome: []}
    secs = await BudgetSections.getSections()
    await Promise.all(secs.map(async (sec) => {
        let trans = await Tran.getTransactionsBySecNameAsync(sec, new Date(new Date().getFullYear(),0), new Date(new Date().getFullYear()+1,0))  //  (secName, startDate, endDate)
        let divided = helper.divideTransByInOut(trans) // [inArray, outArray]
        let plan = await BudgetSections.getSectionBudget(sec)
        
        if(p = plan.find(x => x._id === true)){
            let exec = {
                section: sec,
            }
            exec.incomeBudget = p.budget
            exec.income = helper.generateExecFromTransArray(divided[0])
            result.income.push(exec)
        }
        if(p = plan.find(x => x._id === false)){
            let exec = {
                section: sec,
            }
            exec.outcomeBudget = p.budget
            exec.outcome = helper.generateExecFromTransArray(divided[1])
            result.outcome.push(exec)
        }
        // result.push(exec)
    }))
    res.send(result)
})

// get  year reflection for given section, showing each of its subs
router.get('/:secName', async (req, res)=>{
    try{
        result = { income: [], outcome: []}
        transBySubs = await helper.getSecTransBySubsAsync(req.params.secName, new Date(new Date().getFullYear(),0), new Date(new Date().getFullYear()+1,0))
        transBySubs.forEach(sub => {
            let exec = {
                subSection: sub.subSection,
                plan: sub.budget,
                data: helper.generateExecFromTransArray(sub.trans)
            }
            sub.isIncome ? result.income.push(exec) : result.outcome.push(exec)
        })
        res.send(result)
    } catch(e) { res.status(500).send(e) }
})

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