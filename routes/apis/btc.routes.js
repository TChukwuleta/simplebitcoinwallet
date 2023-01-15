const express = require("express");
const validate = require("../../helpers/validate");
const btcController = require("../../controller/bitcoin.controller");
const btcValidation = require("../../policy/btc.policy");
const { authService } = require("../../services");
const router = express.Router();



// Generate mnemonic endpoint
router.get("/mnemonic", 
    authService.validateToken, 
    btcController.generateMnemonic);


// Generate private key
router.get(
    "/masterkeys", 
    [validate(btcValidation.mnemonicBody), authService.validateToken],
    btcController.generateMasterKeys
);

// Generate p2pkh address
router.get(
    "/p2pkh-address",
    authService.validateToken,
    btcController.generatep2pkhAddress
);

// Generate p2wpkh address
router.get(
    "/p2wpkh-address",
    authService.validateToken,
    btcController.generatep2wpkhAddress
);

// Generate p2sh address
router.get(
    "/p2sh-address",
    authService.validateToken,
    btcController.generatep2shAddress
);

// Generate P2SH(P2WPKH) address
router.get(
    "/p2sh-p2wpkh-address", 
    authService.validateToken,
    btcController.generatep2shp2wpkhAddress
);

module.exports = router; 