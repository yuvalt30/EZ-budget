const express = require('express')
const BudgetSections = require('../models/BudgetSections')
const router = express.Router()
const helper = require('./helper')
const Tran = require('../models/Transaction')
// const PythonShell = require('python-shell')

let {PythonShell} = require('python-shell')


// router.get('/test/', async (req, res)=>{
//     // console.log(await BudgetSections.getSubs())
//     res.send(await helper.getAllTransBySecsAsync())

// })

router.get('/predict', (req,res)=>{
    res.send(
        {
            "name": req.query.name,
            "prediction": "770"
        }
    );return
    var options = {
        args:
        [
          req.body.data, // {'data':[1,2,3,...]}
        ]
      }
      PythonShell.run(__dirname+'\\linear_regression.py', options, function (err, data) {
        if (err) res.send(err)
        result = {
            "name": req.query.name,
            "prediction" : data.toString()
        }
        res.send(result)
      });
})

router.get('/titles', (req,res)=>{
    r = helper.getMonthTitles(new Date(2021,2),new Date())
    res.send(r)
})

router.get('/past', async (req, res) => {
    try{
        sectionName = req.query.sectionName
        subId = req.query.subId
        
        if(subId){
            trans = await Tran.getTransactionsBySubIdAsync(subId)
            if(trans.length == 0){
                res.send("No transactions were found")
                return
            }

            begin = req.query.begin ? new Date(req.query.begin) : trans[trans.length-1].date
            end = req.query.end ? new Date(req.query.end) : trans[0].date
            titles = helper.getMonthTitles(begin, end)
            past = {
                data: new Array(helper.monthDiff(begin,end)+1).fill(0),
                titles: titles,
            }
            trans.forEach(tran => {
                if(tran.date >= begin && tran.date <= end)
                    past.data[helper.monthDiff(begin, tran.date)] += tran.amount
            });
            res.send(past)
            return
        }
        if(sectionName){
            trans = await Tran.getTransactionsBySecNameAsync(sectionName) // sorted
            // trans[0] is newest, trans[trans.length-1] is oldest
            if(trans.length == 0){
                res.send("No transactions were found")
                return
            }
            begin = req.query.begin ? new Date(req.query.begin) : trans[trans.length-1].date
            end = req.query.end ? new Date(req.query.end) : trans[0].date
            titles = helper.getMonthTitles(begin, end)
            range = helper.monthDiff(begin,end)+1
            if(range < 1) {
                res.status(400).send(" Begin date must be earlier than End date")
            }
            past = {
                income: new Array(range).fill(0),
                outcome: new Array(range).fill(0),
                titles: titles,
            }
            let divided = helper.divideTransByInOut(trans) // [inArray, outArray]
            divided[0].forEach(tran => {
                if(tran.date >= begin && tran.date <= end)
                    past.income[helper.monthDiff(begin, tran.date)] += tran.amount
            });
            divided[1].forEach(tran => {
                if(tran.date >= begin && tran.date <= end)
                    past.outcome[helper.monthDiff(begin, tran.date)] += tran.amount
            });
            res.send(past)
            return
        }
        res.status(400).send()
        
    }catch(e) { res.status(500).send(e) }

})

function calcDates(queryStartMonth){
    startMonth = queryStartMonth ? queryStartMonth - 1 : 0
    yearShift = new Date().getMonth() < startMonth ? -1 : 0
    begin = new Date(new Date().getFullYear() + yearShift,startMonth)
    end = new Date(new Date().getFullYear()+yearShift+1,startMonth)
    return [begin,end]
}

// get general current year reflection of all sections, each section as sum of its sub sections
router.get('/test', async (req, res)=>{
    try{
        let totalMonthlyIncomeBudget = 0
        let totalMonthlyOutcomeBudget = 0
        result = { income: [], outcome: [], summary: []}
        dates = calcDates(req.query.startMonth)  //  [begin, end]
        // console.time('getSections')

        secs = await BudgetSections.getSections()
        // console.timeEnd('getSections')
        console.time('await Promise.allsecs')

        await Promise.all(secs.map(async (sec) => {
            // console.time('getTransactionsBySecNameAsync '+sec)
            let trans = await Tran.getTransactionsBySecNameAsync(sec, dates[0], dates[1])  //  (secName, startDate, endDate)
            // console.timeEnd('getTransactionsBySecNameAsync '+sec)
            let divided = helper.divideTransByInOut(trans) // [inArray, outArray]
            // console.time('getSectionBudget '+sec)
            let plan = await BudgetSections.getSectionBudget(sec)
            //  console.timeEnd('getSectionBudget '+sec)
            let toSummary = { section: sec } 
            if(p = plan.find(x => x._id === true)){
                let exec = {
                    section: sec,
                }
                exec.incomeBudget = p.budget
                toSummary.incomeBudget = p.budget
                exec.yearlyIncomeBudget = p.budget * 12
                totalMonthlyIncomeBudget += p.budget
                exec.income = helper.generateExecFromTransArray(divided[0], startMonth)
                result.income.push(exec)
            }
            if(p = plan.find(x => x._id === false)){
                let exec = {
                    section: sec,
                }
                exec.outcomeBudget = p.budget
                toSummary.outcomeBudget = p.budget
                exec.yearlyOutcomeBudget = p.budget * 12
                totalMonthlyOutcomeBudget += p.budget
                exec.outcome = helper.generateExecFromTransArray(divided[1], startMonth)
                result.outcome.push(exec)
            }
            result.summary.push(toSummary)
        }))
        console.timeEnd('await Promise.allsecs')

        result.income.forEach(exec => {
            exec["percentage"] = totalMonthlyIncomeBudget ? Math.round(100 * exec.incomeBudget / totalMonthlyIncomeBudget) : 0
        });
        result.outcome.forEach(exec => {
            exec["percentage"] = totalMonthlyOutcomeBudget ? Math.round(100 * exec.outcomeBudget / totalMonthlyOutcomeBudget) : 0
        });
        result.income.sort(SecNameSorter)
        result.outcome.sort(SecNameSorter)
        result.summary.sort(SecNameSorter)
        res.send(result)
    } catch(e) {
        res.status(500).send(e)
    }
    
})

// get general current year reflection of all sections, each section as sum of its sub sections
router.get('/', async (req, res)=>{
    try{
        let totalMonthlyIncomeBudget = 0
        let totalMonthlyOutcomeBudget = 0
        result = { income: [], outcome: [], summary: []}
        dates = calcDates(req.query.startMonth)  //  [begin, end]
        
        console.time('await Promise.allsecs')
        console.time('getAllTransBySecsAsync')
        transBySecs = await helper.getAllTransBySecsAsync();
        transBySecsDict = {}
        transBySecs.forEach(element => {
            transBySecsDict[element._id] = element.trans
        });
        // res.send(transBySecsDict);return

        console.timeEnd('getAllTransBySecsAsync')
        console.time('getSections')

        allSecs = await BudgetSections.getSections()
        console.timeEnd('getSections')

        await Promise.all(allSecs.map(async (sec) => {
            let found = transBySecsDict[sec]
            let divided
            if(found) divided = helper.divideTransByInOutNew(transBySecsDict[sec]) // [inArray, outArray]
            
            // console.time('getSectionBudget '+sec)
            let plan = await BudgetSections.getSectionBudget(sec)
            // console.timeEnd('getSectionBudget '+sec)
            let toSummary = { section: sec } 
            if(p = plan.find(x => x._id === true)){
                let exec = {
                    section: sec,
                }
                exec.incomeBudget = p.budget
                toSummary.incomeBudget = p.budget
                exec.yearlyIncomeBudget = p.budget * 12
                totalMonthlyIncomeBudget += p.budget
                exec.income = found ? helper.generateExecFromTransArray(divided[0], startMonth) : Array(12).fill(0)

                result.income.push(exec)

            }
            if(p = plan.find(x => x._id === false)){
                let exec = {
                    section: sec,
                }
                exec.outcomeBudget = p.budget
                toSummary.outcomeBudget = p.budget
                exec.yearlyOutcomeBudget = p.budget * 12
                totalMonthlyOutcomeBudget += p.budget
                exec.outcome = found ? helper.generateExecFromTransArray(divided[1], startMonth) : Array(12).fill(0)
                result.outcome.push(exec)
            }
            result.summary.push(toSummary)

        }));
        console.timeEnd('await Promise.allsecs')

        result.income.forEach(exec => {
            exec["percentage"] = totalMonthlyIncomeBudget ? Math.round(100 * exec.incomeBudget / totalMonthlyIncomeBudget) : 0
        });
        result.outcome.forEach(exec => {
            exec["percentage"] = totalMonthlyOutcomeBudget ? Math.round(100 * exec.outcomeBudget / totalMonthlyOutcomeBudget) : 0
        });
        result.income.sort(SecNameSorter)
        result.outcome.sort(SecNameSorter)
        result.summary.sort(SecNameSorter)
        res.send(result)
    } catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
    
})

// get  year reflection for given section, showing each of its subs
router.get('/sec', async (req, res)=>{
    try{
        let totalMonthlyIncomeBudget = 0
        let totalMonthlyOutcomeBudget = 0
        result = { income: [], outcome: [], summary: Array(12).fill(0)}
        dates = calcDates(req.query.startMonth)  //  [begin, end]
        year = req.query.year ? req.query.year : 0
        console.time('getSecTransBySubsAsync')
        transBySubs = await helper.getSecTransBySubsAsync(req.query.secName,  dates[0], dates[1])
        console.timeEnd('getSecTransBySubsAsync')
        console.time('getSubs')
        allSubs = await BudgetSections.getSubs(req.query.secName)
        console.timeEnd('getSubs')

        allSubs.forEach(sub => {
            found = transBySubs.find(t => t.isIncome === sub.isIncome && t.subSection === sub.subSection)
            let exec = {
                section: sub.subSection,
                _id: sub._id
            }
            if(sub.isIncome){
                exec.incomeBudget = sub.budget
                exec.yearlyIncomeBudget = sub.budget * 12
                totalMonthlyIncomeBudget += sub.budget
                exec.income = found ? helper.generateExecFromTransArray(found.trans, startMonth) : Array(12).fill(0)
                result.income.push(exec)
                for (let i = 0; i < 12; i++) {
                    result.summary[i] += exec.income[i]
                }
            } else {
                exec.outcomeBudget = sub.budget
                exec.outcomeBudget = sub.budget
                exec.yearlyOutcomeBudget = sub.budget * 12
                totalMonthlyOutcomeBudget += sub.budget
                exec.outcome = found ? helper.generateExecFromTransArray(found.trans, startMonth) : Array(12).fill(0)
                result.outcome.push(exec)
                for (let i = 0; i < 12; i++) {
                    result.summary[i] -= exec.outcome[i]
                }
            }                    
        });
        result.income.forEach(exec => {
            exec["percentage"] = totalMonthlyIncomeBudget ? Math.round(100 * exec.incomeBudget / totalMonthlyIncomeBudget) : 0
        });
        result.outcome.forEach(exec => {
            exec["percentage"] = totalMonthlyOutcomeBudget ? Math.round(100 * exec.outcomeBudget / totalMonthlyOutcomeBudget) : 0
        });
        result.income.sort(SecNameSorter)
        result.outcome.sort(SecNameSorter)
        res.send(result)
    } catch(e) { res.status(500).send(e) }
})

const SecNameSorter = (a,b)=>{
    let fa = a.section
    let fb = b.section
    if(fa<fb) return -1
    if(fa>fb) return 1
    return 0
}

// // create new section
// router.post('/', async (req, res)=>{
//     update = await BudgetSections.updateOne({
//         sectionName: req.body.sectionName, subSection: req.body.subSection
//         },  
//         {
//         sectionName: req.body.sectionName, subSection: req.body.subSections, isIncome: req.body.isIncome
//         },
//         {upsert: true})
//     if(update.upsertedCount){
//         res.send(update.upsertedCount+" section added")
//     } else {
//         res.send("No section added, requested section already exists")
//     }
// })

module.exports = router