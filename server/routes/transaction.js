const express = require('express')
const Transacion = require('../models/Transaction')
const Sections = require('../models/BudgetSections')
const router = express.Router()

// get all Transactions
router.get('/', async (req, res)=>{
    const allTransactions = await Transacion.find({}).sort({date: 1})
    res.send(allTransactions)
})

async function createNewTransaction(section, amount, description, date){
    const newTransaction = new Transacion({section: section, amount: amount});
    if(date) newTransaction.date = date
    if(description) newTransaction.description = description
    try{
        await newTransaction.save();
        return true
    } catch(err){
        return false
    }
}

// create new transaction manually
router.post('/', async (req, res)=>{
    if (createNewTransaction(req.body.section, req.body.amount, req.body.description, req.body.date)) res.status(201).send()
    else res.status(500).send()
})

// create many transaction from CSV file
router.post('/file', async (req, res)=>{
    inserted=0
    e=0
    await Promise.all(req.body.transactions.map(async tran => {
        secId = await Sections.getSubIdByNames(tran.sectionName, tran.subSection)
        if(secId == null) e+=1
        else if (createNewTransaction(secId, tran.amount, tran.description, tran.date)) inserted+=1
            else e +=1
    }))
    if(inserted){
        res.status(201).send(e ? inserted+" inserted, "+e+" errors, ensure section and sub section exist" : "all "+inserted+" transactions inserted")
    } else res.status(400).send("all "+e+" insertions failed, ensure section and sub section exist")
})

module.exports = router