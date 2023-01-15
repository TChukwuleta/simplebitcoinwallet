const { errorResponse, successResponse } = require("../helpers/responseHelper")
const bip39 = require("bip39")
const bitcoin = require("bitcoinjs-lib")
const bip32 = require("bip32")
const { 
    generateChangeAddresses, 
    generateAddressBatch,
    getUtxoFromAddresses
} = require("../helpers/bitcoinutil")

// Bitcoin network
const network = bitcoin.networks.testnet;
// Derivation path
const path = `m/44'/0'/0'/0`

const generateMnemonic = async (req, res, next) => {
    try {
        const mnemonic = await bip39.generateMnemonic(256)
        return successResponse(res, 200, "Mnemonic generation was successful", mnemonic)
    } catch (error) {
        const message = error.message || error;
        const code = error.code || 400;
        errorResponse(res, code, message);
    }
}

const generateMasterKeys = async (req, res, next) => {
    try {
        const seed = await bip39.mnemonicToSeed(req.body.mnemonic);
        const root = bip32.fromSeed(seed, network);
        const xprv = root.toBase58();
        const xpub = root.derivePath(path).neutered().toBase58();
        const data = {
            xprv,
            xpub
        }
        return successResponse(res, 200, "Private key generation was successful", data);
    } catch (error) {
        const message = error.message || error;
        const code = error.code || 400;
        errorResponse(res, code, message);
    }
}  

const generatep2shp2wpkhAddress = async (req, res, next) => {
    try {
        const root = req.body.publickey;
        const node = bip32.fromBase58(root, network);
        let address = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({
                pubkey: node.publicKey,
                network
            }),
            network
        }).address
        successResponse(res, 200, "P2SH(P2WPKH) address generation was successful", address);
    } catch (error) {
        const message = error.message || error;
        const code = error.code || 400;
        errorResponse(res, code, message);
    }
}

const generatep2pkhAddress = async (req, res, next) => {
    try {
        const root = req.body.publickey;
        const node = bip32.fromBase58(root, network);
        const address = bitcoin.payments.p2pkh({
            pubkey: node.publicKey,
            network
        }).address
        successResponse(res, 200, "P2PKH address generation was successful", address);
    } catch (error) {
        const message = error.message || error;
        const code = error.code || 400;
        errorResponse(res, code, message);
    }
}

const generatep2shAddress = async (req, res, next) => {
    try {
        const root = req.body.publickey;
        const node = bip32.fromBase58(root, network);
        const segwitAddress = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({pubkey: node.publicKey, network}),
            network: network
        }).address;
        successResponse(res, 200, "Segwit address (p2sh) generated successfully", segwitAddress);
    } catch (error) {
        const message = error.message || error;
        const code = error.code || 400;
        errorResponse(res, code, message);
    }
}

const generatep2wpkhAddress = async (req, res, next) => {
    try {
        const root = req.body.publickey;
        const node = bip32.fromBase58(root, network);
        const p2wpkhAddress = bitcoin.payments.p2wpkh({
            pubkey: node.publicKey,
            network
        }).address;
        successResponse(res, 200, "P2WSH address generation was successful", p2wpkhAddress);
    } catch (error) {
        const message = error.message || error;
        const code = error.code || 400;
        errorResponse(res, code, message);
    }
}

const createTransaction = async (req, res, next) => {
    try {
        const publicKey = req.body.publickey;
        const recipientAddress = req.body.recipient;
        const amount = req.body.amount;
        const addresstype = req.body.type;
        const privatekey = req.body.privatekey;
        const root = bip32.fromBase58(privatekey, network);

        const currentAddressBatch = generateAddressBatch(publicKey, root, addresstype);
        const currentChangeAddressBatch = generateChangeAddresses(publicKey, root, addresstype);
        const addresses = [...currentAddressBatch, ...currentChangeAddressBatch];
        const utxos = await getUtxoFromAddresses(addresses, root);


    } catch (error) {
        const message = error.message || error;
        const code = error.code || 400;
        errorResponse(res, code, message);
    }
}


module.exports = {
    generateMnemonic,
    generateMasterKeys,
    generatep2pkhAddress,
    generatep2shAddress,
    generatep2wpkhAddress,
    generatep2shp2wpkhAddress,
    createTransaction
}