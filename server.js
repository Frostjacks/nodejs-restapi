require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const subscribersRouter = require('./routes/subscribers')

const app = express()

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', ()=> console.log('connected to database'))

// this basically allows our server to accept json as a body
// we write this in building api and we use app.use(express.urlencoded({ extended: false })) while rendering the frontend code which accepts the data as string or array but not json
app.use(express.json())

app.use('/subscribers', subscribersRouter)

app.listen(3000, () => console.log('server started'))