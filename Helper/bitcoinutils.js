const bip39= require('bip39')
const bip32 = require('bip32')
const bitcoin = require('bitcoinjs-lib')


const getAddress = async (req, res) => {
    const network = bitcoin.networks.testnet
    const derivationPath = "m/84'/0'/0'" // P2WPKH
    const path = `m/44'/0'/0'/0`
    // Use `m/44'/1'/0'/0
    // Use `m/49'/1'/0'/0
    // Generate mnemonic
    const mnemonic = bip39.generateMnemonic(256)
    console.log(`Mnemonic is: ${mnemonic}`)
    const seed = await bip39.mnemonicToSeed(mnemonic)
    // Derive privatekey
    const privateKey = bip32.fromSeed(seed, network)
    // Fingerprint
    //const fingerPrint = privateKey.fingerprint
    console.log(`Private key is: ${privateKey.toBase58()}`)
    
    // Generating extended public key
    const child = privateKey.derivePath(derivationPath)
    const node = child.derive(0).derive(0)

    const p2pkhAddress = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: network
    }).address

    const p2wpkhAddress = bitcoin.payments.p2wpkh({
        pubkey: node.publicKey,
        network: network
    }).address

    const segwitAddress = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({pubkey: node.publicKey, network: network}),
        network: network
    }).address;
    console.log(`SegWit address: ${segwitAddress}`);
    res.status(201).send(`p2pkh address is: ${p2pkhAddress}... p2wpkh address is ${p2wpkhAddress}... p2sh address is: ${segwitAddress}`)
}



module.exports = {
    getAddress
}