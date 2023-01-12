const router = require("express").Router();
const { mnemonicBody, publicKeyBody } = require("../../policy")
const validate = require('../../helpers/validate');
const { 
    generateMnemonic,
    generateMasterKeys,
    generatep2pkhAddress,
    generatep2wpkhAddress,
    generatep2shAddress,
    generatep2shp2wpkhAddress
} = require("../../controller/walletController");

// Generate mnemonic endpoint
router.get("/mnemonic", generateMnemonic);


// Generate private key endpoint
router.get(
    "/masterkeys", 
    [validate(mnemonicBody)],
    generateMasterKeys
);

// Generate p2pkh address
router.get(
    "/p2pkh-address",
    [validate(publicKeyBody)],
    generatep2pkhAddress
);

// Generate p2wpkh address
router.get(
    "/p2wpkh-address",
    [validate(publicKeyBody)],
    generatep2wpkhAddress
);

// Generate p2sh address
router.get(
    "/p2sh-address",
    [validate(publicKeyBody)],
    generatep2shAddress
);

// Generate P2SH(P2WPKH) address
router.get(
    "/p2sh-p2wpkh-address",
    [validate(publicKeyBody)],
    generatep2shp2wpkhAddress
);

module.exports = router;