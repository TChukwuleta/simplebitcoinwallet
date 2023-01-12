const router = require('express').Router()
const bitUtils = require('../helpers/bitcoinutils')

router.post("/test", bitUtils.getAddress)

module.exports = router