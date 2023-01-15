const router = require("express").Router();
const userRouter = require("./auth.routes");
const bitcoinRouter = require("./btc.routes");

router.use("/user", userRouter);
router.use("/btc", bitcoinRouter);

module.exports = router;