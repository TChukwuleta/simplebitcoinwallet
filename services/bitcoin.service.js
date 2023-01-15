const bip39 = require("bip39");
const bip32 = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const ApiError = require("../helpers/ApiError");
const {
    generateChangeAddresses,
    generateAddressBatch,
    getUtxoFromAddresses
} = require("../helpers/bitcoinutil");

// Bitcoin network
const network = bitcoin.networks.testnet;
// Derivation path
const path = `m/44'/0'/0'/0`;

const generateMnemonic = async () => {
    try {
        const mnemonic = await bip39.generateMnemonic(256);
        return JSON.parse(JSON.stringify(mnemonic));
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);  
    }
}

const generateMasterKeys = async (data) => {
    try {
        const seed = await bip39.mnemonicToSeed(data.mnemonic);
        const root = bip32.fromSeed(seed, network);
        const xprv = root.toBase58();
        const xpub = root.derivePath(path).neutered().toBase58();
        const keys = {xprv, xpub};
        return JSON.parse(JSON.stringify(keys));
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);  
    }
}

const generatep2shp2wpkhAddress = async (publickey) => {
    try {
        const node = bip32.fromBase58(publickey, network);
        let address = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({
                pubkey: node.publicKey,
                network
            }),
            network
        }).address;
        return JSON.parse(JSON.stringify(address));
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);  
    }
}

const generatep2pkhAddress = async (publickey) => {
    try {
        const node = bip32.fromBase58(publickey, network);
        const address = bitcoin.payments.p2pkh({
            pubkey: node.publicKey,
            network
        }).address;
        return JSON.parse(JSON.stringify(address)); 
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);  
    }
}

const generatep2shAddress = async (publickey) => {
    try {
        const node = bip32.fromBase58(publickey, network);
        const segwitAddress = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({pubkey: node.publicKey, network}),
            network: network
        }).address;
        return JSON.parse(JSON.stringify(segwitAddress));
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error); 
    }
}

const generatep2wpkhAddress = async (data) => {
    try {
        const root = data.publickey;
        const node = bip32.fromBase58(root, network);
        const p2wpkhAddress = bitcoin.payments.p2wpkh({
            pubkey: node.publicKey,
            network
        }).address;
        return JSON.parse(JSON.stringify(p2wpkhAddress));
    } catch (error) {
        const message = error.message || error;
        const code = error.code || 400;
        errorResponse(res, code, message);
    }
}

const createTransaction = async (data) => {
    try {
        const publicKey = data.publickey;
        const recipientAddress = data.recipient;
        const amount = data.amount;
        const addresstype = data.type;
        const privatekey = data.privatekey;
        const root = bip32.fromBase58(privatekey, network);

        const currentAddressBatch = generateAddressBatch(publicKey, root, addresstype);
        const currentChangeAddressBatch = generateChangeAddresses(publicKey, root, addresstype);
        const addresses = [...currentAddressBatch, ...currentChangeAddressBatch];
        const utxos = await getUtxoFromAddresses(addresses, root);
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error); 
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