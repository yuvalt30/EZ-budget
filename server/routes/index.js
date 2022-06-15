const express = require('express')
const router = express.Router()
const BudgetSections = require('../models/BudgetSections')
const Trans = require('../models/Transaction')

router.get('/', async (req, res)=>{
    const section = new Track({section: '6295091866b45d3af17cdc9e',monthlyPlan: 1500, exec: {year: 2022, jan: 1600}});
    const section2 = new Track({section: '6295090066b45d3af17cdc97', monthlyPlan: 1000, exec: {year: 2022, jan: 900}});
    const section3 = new Track({section: '6295090066b45d3af17cdc96',monthlyPlan: 500, exec: {year: 2022, jan: 450}});
    const section4 = new Track({section: '6295090066b45d3af17cdc98',monthlyPlan: 1000, exec: {year: 2022, jan: 900}});

    try{
        newSection = await section.save();
        newSection2 = await section2.save();
        newSection3 = await section3.save();
        newSection4 = await section4.save();
        res.send(newSection+'\n'+newSection2+'\n'+newSection3+'\n'+newSection4+'\n')
    } catch(err){
        console.log(err)
    }

    // const section = new BudgetSections({sectionName: "ישיבה", subSection: 'חשמל', isIncome: false})
    // const section2 = new BudgetSections({sectionName: "ישיבה", subSection:'תרומות', isIncome: true})
    // const section3 = new BudgetSections({sectionName: "מדרשה", subSection: 'שכר לימוד', isIncome: true})
    // const section4 = new BudgetSections({sectionName: "מדרשה", subSection: 'תחזוקה', isIncome: false})
    // try{
    //     newsection = await section.save();
    //     newsection2 = await section2.save();
    //     newsection3 = await section3.save();
    //     newsection4 = await section4.save();
    //     res.send(newsection+'\n'+newsection2+'\n'+newsection3+'\n'+newsection4)
    // } catch(err){
    //     console.log(err)
    // }

    // const tr = new Trans({section:'6295091866b45d3af17cdc9e', amount: 300})
    // const tr2 = new Trans({section:'6295090066b45d3af17cdc97', amount: 400})
    // const tr3 = new Trans({section:'6295090066b45d3af17cdc98', amount: 500})
    // const tr4 = new Trans({section:'6295090066b45d3af17cdc96' , amount: 1200})
    // try{
    //     t = await tr.save();
    //     t2 = await tr2.save();
    //     t3 = await tr3.save();
    //     t4 = await tr4.save();
    //     res.send(t+'\n'+t2+'\n'+t3+'\n'+t4+'\n')
    // } catch(err){
    //     console.log(err)
    // }
})

module.exports = router