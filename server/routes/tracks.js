const express = require('express')
const BudgetSections = require('../models/BudgetSections')
const Reflection = require('../models/Track')
const Trans = require('../models/Transaction')
const router = express.Router()
const helper = require('./helper')


async function getSectionsWithTrans(){
    res = []
    console.log('start')
    
    return
}

function generateTrack(sectionId){
    section = Trans.find({section: sectionId  })
    console.log(section)
}

// get general reflection of each section, as sum of its sub sections
router.get('/', async (req, res)=>{
    let e = [0,0,0,0,0,0,0,0,0,0,0,0,]
        subs = await BudgetSections.getSubs('ישיבה')
        await subs.forEach(async (sub) => {
            console.log('#####'+sub+'#####')

            await Trans.find({section: sub._id}).then(docs=>
                {
                    console.log(docs)
                    if(docs[0]){
                        docs.forEach(doc => {
                            e[docs[0].date.getMonth()+1] += docs[0].amount
                        })
                        console.log(e)

                    }
                })
        })
        res.send('OK')
})

// get reflection of specific section, showing each sub section
router.get('/section', async (req, res)=>{
    try{
    const aSection = await Reflection.find({sectionName: req.query.sectionName})

    res.send(aSection[0].subSections)
    }catch(err){
        res.send(err)
        console.log(err)
    }
})

// create new section
router.post('/', async (req, res)=>{
    const newSection = new BudgetSections({sectionName: req.body.sectionName, subSections: req.body.subSections});
    try{
        await newSection.save();
        res.send("inserted data")
    } catch(err){
        console.log(err)
    }
})

module.exports = router