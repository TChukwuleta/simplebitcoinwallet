const express = require('express')
const dotenv = require("dotenv")
const routes = require('./routes')
require("./config/mongoose");
dotenv.config()

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/", routes) 

module.exports = app