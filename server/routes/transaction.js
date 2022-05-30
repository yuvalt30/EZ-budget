const express = require('express')
const Transacion = require('../models/Transaction')
const router = express.Router()

// get all Transactions
router.get('/', async (req, res)=>{
    const allTransactions = await Transacion.find({}).sort({date: 1})
    res.send(allTransactions)
})

// // get all Transacions by type (income/outcome)
// router.get('/type', async (req, res)=>{
//     try{
//     const transactions = await BudgetSections.find({isIncome: req.query.isIncome})

//     res.send(transactions)
//     }catch(err){
//         res.send(err)
//         console.log(err)
//     }
// })

// create new transaction
router.post('/', async (req, res)=>{
    const newTransaction = new Transacion({sectionName: req.body.sectionName, subSections: req.body.subSections, amount: req.body.amount});
    try{
        await newTransaction.save();
    } catch(err){
        console.log(err)
    }
})

module.exports = router