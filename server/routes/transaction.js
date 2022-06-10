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
    inserted=0
    err=0
    console.log(req.body.transactions)
    await Promise.all(req.body.transactions.map(async tran => {
        if (createNewTransaction(tran.section, tran.amount, tran.description, tran.date)) inserted+=1
        else err +=1
    }))
    if(inserted){
        res.status(201).send(err ? inserted+" inserted, "+err+" errors" : "all "+inserted+" transactions inserted")
    }
})

// create many transaction from CSV file
router.post('/file', async (req, res)=>{
    inserted=0
    err=0
    await Promise.all(req.body.transactions.map(async tran => {
        if (createNewTransaction(await Sections.getSubIdByNames(tran.sectionName, tran.subSection), tran.amount, tran.description, tran.date)) inserted+=1
        else err +=1
    }))
    if(inserted){
        res.status(201).send(err ? inserted+" inserted, "+err+" errors" : "all "+inserted+" transactions inserted")
    }
})

module.exports = router