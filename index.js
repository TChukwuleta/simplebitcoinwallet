const express = require('express')
const app = express()
const bitRoutes = require('./routes/authRoutes')

app.use(express.urlencoded({ extended : false }))
app.use(express.json())

app.use('/api', bitRoutes)

const port = 3004
app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})