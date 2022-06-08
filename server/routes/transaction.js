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
    const newTransaction = new Transacion({section: req.body.section, amount: req.body.amount});
    if(req.body.date) newTransaction.date = req.body.date
    try{
        await newTransaction.save();
        res.status(201).send()
    } catch(err){
        console.log(err)
        res.status(500).send()
    }
})

//TODO: create many transaction from CSV file

module.exports = router