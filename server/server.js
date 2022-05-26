const express = require("express")
const mongoose = require("mongoose")
const app = express()
require('dotenv').config()

const indexRouter = require('./routes/index')
const sectionsRouter = require('./routes/sections')


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
});
const db = mongoose.connection
db.on('error', err => console.log(err))
db.once('open', () => console.log('Connected to Mongoose'))


app.use('/', indexRouter)
app.use('/sections', sectionsRouter)

const port = process.env.PORT || 3001
app.listen(port, ()=>{
    console.log("server is listening on port " + port)
})