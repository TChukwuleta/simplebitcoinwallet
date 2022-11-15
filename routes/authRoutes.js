const router = require('express').Router()
const bitUtils = require('../Helper/bitcoinutils')

router.post("/test", bitUtils.getAddress)

module.exports = router