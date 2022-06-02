const express = require('express')
const Transacion = require('../models/Transaction')
const router = express.Router()

// get all Transactions
router.get('/', async (req, res)=>{
    const allTransactions = await Transacion.find({}).sort({date: 1})
    res.send(allTransactions)
})

// create new transaction
router.post('/', async (req, res)=>{
    const newTransaction = new Transacion({sectionName: req.body.sectionName, subSections: req.body.subSections, amount: req.body.amount});
    try{
        await newTransaction.save();
    } catch(err){
        console.log(err)
    }
})

//TODO: create many transaction from CSV file

module.exports = router