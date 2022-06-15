if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require("express")
const mongoose = require("mongoose")
const app = express()
app.use(express.json())

const indexRouter = require('./routes/index')
const sectionsRouter = require('./routes/sections')
const tracksRouter = require('./routes/tracks')
const transactionsRouter = require('./routes/transaction')
const usersRouter = require('./routes/users')

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
});
const db = mongoose.connection
db.on('error', err => console.log(err))
db.once('open', () => console.log('Connected to Mongoose'))


app.use('/', indexRouter)
app.use('/sections', sectionsRouter)
app.use('/tracks', tracksRouter)
app.use('/transactions', transactionsRouter)
app.use('/users', usersRouter)

const port = process.env.PORT || 3001
app.listen(port, ()=>{
    console.log("server is listening on port " + port)
})