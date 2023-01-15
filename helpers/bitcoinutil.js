const axios = require("axios");
const dotenv = require("dotenv");
const bitcoin = require("bitcoinjs-lib");
dotenv.config();

// Bitcoin network
const network = bitcoin.networks.testnet;
// Derivation path
const path = `m/44'/0'/0'/0`
// Blockstream URL
const baseUrl = process.env.BASE_URL;

// Generate 10 change addresses for user
const generateChangeAddresses = (pubkey, root, addressType = null) => {
    const addressBatch = [];
    let currentAddress; 
    for (let i = 0; i < 10; i++) {
        const newPath = `${path}'1/${i}`;
        const currentChildPubkey = deriveChildPublicKey(pubkey, newPath);
        if(!addressType || addressType == null){
            currentAddress = getAddressFromChildPublicKey(currentChildPubkey);
        }
        else {
            currentAddress = getAddressFromChildPublicKey(currentChildPubkey, addressType);
        }

        addressBatch.push({
            ...currentAddress,
            newPath,
            masterFingerprint: root.fingerprint
        });
    }
    return addressBatch;
}

// Generate 10 random addresses
const generateAddressBatch = (pubkey, root, addressType = null) => {
    const addressBatch = [];
    let currentAddress;
    for (let i = 0; i < 10; i++) {
        const newPath = `${path}'1/${i}`;
        const currentChildPubkey = deriveChildPublicKey(pubkey, newPath);
        if(!addressType || addressType == null){
            currentAddress = getAddressFromChildPublicKey(currentChildPubkey);
        }
        else {
            currentAddress = getAddressFromChildPublicKey(currentChildPubkey, addressType);
        }

        addressBatch.push({
            ...currentAddress,
            newPath,
            masterFingerprint: root.fingerprint
        });
    }
    return addressBatch;
}

const deriveChildPublicKey = (publicKey, derivationPath) => {
    const node = bip32.fromBase58(publicKey, network);
    const child = node.derivePath(derivationPath);
    return child;
}

const getAddressFromChildPublicKey = (child, type = 'p2pkh') => {
    let address;
    if(type == 'p2wpkh'){
        address = bitcoin.payments.p2wpkh({
            pubkey: child.publicKey,
            network
        });
        return address;
    }

    address = bitcoin.payments.p2pkh({
        pubkey: child.publicKey,
        network
    });
    return address;
};

const getTransactionsFromAddress = async (address) => {
    const {data} = await axios.get(`${baseUrl}/address/${address.address}/txs`);
    return data;
}

const getUtxosFromAddress = async (address) => {
    const { data } = await axios.get(`${baseUrl}/address/${address.address}/utxo`);
    return data;
}

const broadcastTransactions = async (txHex) => {
    const { data } = await axios.post(`${baseUrl}/tx`, txHex);
    return data;
}

const getUtxoFromAddresses = async (addresses, root) => {
    const allAddressesUtxos = [];

    for(let address of addresses) {
        const utxos = await getUtxosFromAddress(address);
        for(let utxo of utxos){
            allAddressesUtxos.push({
                ...utxo,
                address,
                bip32Derivation: [{
                    pubkey: address.pubkey,
                    path: address.newPath,
                    masterFingerprint: root.fingerprint
                }]
            })
        }
    }
    return allAddressesUtxos;
}
 

module.exports = {
    generateChangeAddresses,
    generateAddressBatch,
    deriveChildPublicKey,
    getAddressFromChildPublicKey,
    getTransactionsFromAddress,
    getUtxosFromAddress,
    broadcastTransactions,
    getUtxoFromAddresses
}