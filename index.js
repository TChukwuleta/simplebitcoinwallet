const app = require('./app')

const port = process.env.PORT || 9003


app.listen(port, () => {
    console.log(`Speak Lord, your application is listening on port: ${port}`)
})