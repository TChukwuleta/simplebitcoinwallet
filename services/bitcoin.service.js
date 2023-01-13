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
        const data = {xprv, xpub};
        return JSON.parse(JSON.stringify(data));
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);  
    }
}

const generatep2shp2wpkhAddress = async (data) => {
    try {
        const root = data.publickey;
        const node = bip32.fromBase58(root, network);
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

const generatep2pkhAddress = async (data) => {
    try {
        const root = data.publickey;
        const node = bip32.fromBase58(root, network);
        const address = bitcoin.payments.p2pkh({
            pubkey: node.publicKey,
            network
        }).address;
        return JSON.parse(JSON.stringify(address)); 
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);  
    }
}