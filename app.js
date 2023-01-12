const express = require('express')
const dotenv = require("dotenv")
const routes = require('./routes')
const bitRoutes = require('./routes/authRoutes')
dotenv.config()

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// const path = `m/44'/0'/0'/0`
// const fullpath = `${path}'1/1`
// console.log("full path is: ", fullpath);
// Routes
app.use("/", routes)
app.use('/bit/api', bitRoutes)

module.exports = app