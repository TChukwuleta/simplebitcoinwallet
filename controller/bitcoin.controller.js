const ApiError = require("../helpers/ApiError");
const catchAsync = require("../helpers/catchAsync");
const encryptionMethod = require("../helpers/encryption");
const { bitcoinService, authService } = require("../services");
require('dotenv').config();

const generateMnemonic = catchAsync(async (req, res) => {
    const mnemonic = await bitcoinService.generateMnemonic();
    res.status(201).send({
        message: "Mnemonic generated successfully",
        data: {
            mnemonic
        }
    });
})

const generateMasterKeys = catchAsync(async (req, res) => {
    const keys = await bitcoinService.generateMasterKeys(req.mnemonic);
    res.status(201).send({
        message: "Extended private and public key generated successfully",
        data: {
            keys
        }
    })
})

const generatep2shp2wpkhAddress = catchAsync(async (req, res) => {
    const user = authService.getUserById(req.user._id);
    const pubKey = encryptionMethod.decryptKey(user.publickey);
    const address = await bitcoinService.generatep2shp2wpkhAddress(pubKey);
    res.status(201).send({
        message: "p2shp2wpkh address generated successfully",
        data: {
            address
        }
    })
})

const generatep2pkhAddress = catchAsync(async (req, res) => {
    const user = authService.getUserById(req.user._id);
    const pubKey = encryptionMethod.decryptKey(user.publickey);
    const address = await bitcoinService.generatep2pkhAddress(pubKey);
    res.status(201).send({
        message: "p2pkh address generated successfully",
        data: {
            address
        }
    })
})

const generatep2shAddress = catchAsync(async (req, res) => {
    const user = authService.getUserById(req.user._id);
    const pubKey = encryptionMethod.decryptKey(user.publickey);
    const address = await bitcoinService.generatep2shAddress(pubKey);
    res.status(201).send({
        message: "p2sh address generated successfully",
        data: {
            address
        }
    })
})

const generatep2wpkhAddress = catchAsync(async (req, res) => {
    const user = authService.getUserById(req.user._id);
    const pubKey = encryptionMethod.decryptKey(user.publickey);
    const address = await bitcoinService.generatep2wpkhAddress(pubKey);
    res.status(201).send({
        message: "p2wpkh address generated successfully",
        data: {
            address
        }
    })
})

const generateTransaction = catchAsync(async (req, res) => {
    const user = authService.getUserById(req.user._id);
    const pubKey = encryptionMethod.decryptKey(user.publickey);
    const privKey = encryptionMethod.decryptKey(user.privatekey);
    const payload = {
        publickey: pubKey,
        recipient: req.body.recipient,
        amount: req.body.amount,
        privatekey: privKey
    }
    const bitcoinTransaction = await bitcoinService.createTransaction(payload);
    res.status(201).send({
        message: "Bitcoin transaction created successfully",
        data: {
            bitcoinTransaction
        }
    })
})

module.exports = {
    generateMnemonic,
    generateMasterKeys,
    generatep2shp2wpkhAddress,
    generatep2pkhAddress,
    generatep2shAddress,
    generatep2wpkhAddress,
    generateTransaction
}