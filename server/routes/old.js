const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors')
const app = express()

require('dotenv').config()
const { auth } = require('express-openid-connect');

app.use(
  auth({
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true,
  })
);

const BudgetModel = require("../models/Budget")

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
});
const db = mongoose.connection
db.on('error', err => console.log(err))
db.once('open', () => console.log('Connected to Mongoose'))


app.get("/", async (req, res) => {
    
    const budge = new BudgetModel({instName: 'yesh', instCFO: 'dav', amount: 18})
    try{
        await budge.save();
        res.send("inserted data")
    } catch(err){
        console.log(err)
    }
})


app.post("/insert", async (req, res) => {
    const instName = req.body.instName
    const CFOName = req.body.CFOName
    const amount = req.body.amount
 
    const budge = new BudgetModel({instName: instName, instCFO: CFOName, amount: amount});
    try{

        await budge.save();
        res.send("inserted data")
    } catch(err){
        console.log(err)
    }
})

app.put("/update", async (req, res) => {
    const newAmount = req.body.newAmount
    const id = req.body.id

    try{
        await BudgetModel.findById(id, (err, updatedBudget)=>{
            updatedBudget.amount = newAmount
            updatedBudget.save()
            res.send("update:" + updatedBudget.amount + "#")
        })
    } catch(err){
        console.log(err)
    }
})

app.get("/read", async (req, res) => {
    BudgetModel.find({}, (err, result) => {
        if(err){
            res.send(err)
        }

        res.send(result)
    })
})

const port = process.env.PORT || 3001
app.listen(port, ()=>{
    console.log("server is listening on port " + port)
})