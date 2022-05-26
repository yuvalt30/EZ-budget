const express = require('express')
const router = express.Router()
const BudgetSections = require('../models/BudgetSections')

router.get('/', async (req, res)=>{
    const section = new BudgetSections({sectionName: 'yeshiva', subSections: ['ניקיון','חשמל','אחזקה']});
    const section2 = new BudgetSections({sectionName: 'מדרשה', subSections: ['אבטחה','חשמל','שכר מרצים']});

    try{
        newSection = await section.save();
        newSection2 = await section2.save();
        res.send(newSection+newSection2)
    } catch(err){
        console.log(err)
    }
})

module.exports = router