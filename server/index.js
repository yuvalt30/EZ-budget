const express = require("express")
const mongoose = require("mongoose")
const app = express()

const BudgetModel = require("./models/Budget")

app.use(express.json())

mongoose.connect("mongodb+srv://yuvalt30:yt6073463@ezb.xoqka.mongodb.net/budget?retryWrites=true&w=majority", {
    useNewUrlParser: true,
});


app.get('/', async (req, res) => {
    const budge = new BudgetModel({instName: "yeshiva", instCFO: "David", amount: 1000})

    try{
        await budge.save();
        res.send("inserted data")
    } catch(err){
        console.log(err)
    }
})

app.listen(3001, ()=>{
    console.log("server run on port 3001")
})