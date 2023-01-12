const express = require('express')
const apis = require("./apis")

const router = express.Router()

router.get("/", (req, res) => {
    res.status(200).send("Welcome aboard")
})

router.use("/api", apis)

router.all("*", (req, res) => {
    const errorResponse = {
        message: "Invalid endpoint specified",
        endpointList: {
            homepage: 'GET /',
            generatemnemonic: 'GET /api/mnemonic',
            getextendedkeys: 'GET /api/masterkeys'
        }
    }

    res.status(404).json(errorResponse);
})

module.exports = router