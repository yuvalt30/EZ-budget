const express = require('express')
const Transacion = require('../models/Transaction')
const Sections = require('../models/BudgetSections')
const router = express.Router()

// get all Transactions
router.get('/', async (req, res)=>{
    const allTransactions = await Transacion.find({}, { 
        // "section": "$section.sectionName",
        // "subSection": "$section.subSection",
        // "amount": "$amount",
        // "date": "$date",
        // "description": "$description"
     }).populate('section').sort({date: 1})
    res.send(allTransactions)
})

async function createNewTransactionAsync(section, amount, description, date){
    const newTransaction = new Transacion({section: section, amount: amount});
    if(date) newTransaction.date = new Date(date)
    if(description) newTransaction.description = description
    try{
        await newTransaction.save();
    } catch(err){
        console.log(newTransaction)
        console.log(err)
        return false
    }
    console.log('success date='+date)
    return true
}

// create new transaction manually
router.post('/', async (req, res)=>{
    if (await createNewTransactionAsync(req.body.section, req.body.amount, req.body.description, req.body.date)) res.status(201).send()
    else res.status(500).send()
})

// create many transaction from CSV file
router.post('/file', async (req, res)=>{
    let inserted=0
    let notExist=0
    let e=0
    // console.log(req.body.transactions)
    await Promise.all(req.body.transactions.map(async tran => {
        secId = await Sections.getSubIdByNames(tran.sectionName, tran.subSection, req.body.isIncome)
        if(secId == null) {notExist+=1; console.log("non exist secName: ,"+tran.sectionName+",\tsub: ," +tran.subSection+',')}
        else {if (await createNewTransactionAsync(secId, tran.amount, tran.description, tran.date)) {inserted+=1}
            else {e +=1}}
    }))
    if(inserted){
        console.log(inserted+" inserted, "+e+" errors, "+notExist+" non existing sections")
        res.status(201).send(e ? inserted+" inserted, "+e+" errors, ensure section and sub section exist" : "all "+inserted+" transactions inserted")
    } else res.status(400).send("all "+e+" insertions failed, ensure section and sub section exist")
})

module.exports = router