const express = require('express')
const Users = require('../models/users')
const BudgetSections = require('../models/BudgetSections')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')


async function getUserByEmail(anEmail) {
    return await Users.findOne({email: anEmail})
}

// router.get('/ismailexsist',async  (req, res) => {
//     console.log(req.params.email)
//     res.json(await getUserByEmail(req.params.email))
// })
// const initializePassport = require('./passport-config')
// const { Router } = require('express')
// initializePassport(passport,getUserByEmail,getUserById)

// get all sections, no subs
router.get('/sections', authenticateToken, async (req, res)=>{
    user = await Users.findById(req.user.id, 'permissions role -_id')
    if(user.role == 'ceo' || user.role == 'admin') res.send(await BudgetSections.getSections())
    else res.send(user.permissions)

})


router.get('/', authenticateToken, async (req, res) => {
    res.json( await Users.findById(req.user.id)) 
})

router.post('/login', /*checkNotAuthenticated,*/ async (req, res) => {
    // Auth
    const email = req.body.email
    user = await getUserByEmail(email)
    if(user == null) res.status(404).send('Email or password is incorrect.')
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const anUser = { id: user._id.toString()}
            const accesToken = jwt.sign(anUser, process.env.ACCESS_TOKEN_SECRET)
            res.json({accessToken: accesToken, name: user.name, role: user.role})
        } else {
            res.status(404).send('email or Password is incorrect.')
        }
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/register',/*checkNotAuthenticated,*/ async (req, res)=> {
    try{
        if(await getUserByEmail(req.body.email)) res.status(400).send("email already exist")
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new Users({
            name: req.body.name,
            password: hashedPassword,
            email: req.body.email,
            role: req.body.role,
            permissions: req.body.permissions
        })
        console.log(newUser)
        await newUser.save()
        // res.redirect('/login')
        res.status(201).send()
    } catch {
        // res.redirect('/register')
        res.status(500).send()
    }
    
    const user = new Users({
        username: req.body.username, password: req.body.password})
        await user.save()
        res.status(201).send()
})

router.delete('/', async (req, res) => {
    if(await getUserByEmail(req.body.email)) {
        await Users.deleteOne({email: req.body.email})
        res.send(req.body.email+" user deleted")
    } else res.status(400).send("email doesn't exist")
})

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }

    next()
}

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

// module.exports = {router, authenticateToken}
module.exports = router