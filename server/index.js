const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors')
const app = express()

const BudgetModel = require("./models/Budget")

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://yuvalt30:yt6073463@ezb.xoqka.mongodb.net/budget?retryWrites=true&w=majority", {
    useNewUrlParser: true,
});


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
        res.send(instName + CFOName + " amount = " + amount)

        await budge.save();
        res.send("inserted data")
    } catch(err){
        console.log(err)
    }
})

app.listen(3001, ()=>{
    console.log("server run on port 3001")
})