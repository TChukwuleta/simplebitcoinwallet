const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const coinkey = require('coinkey')
const bitcore = require('bitcore-lib')
const Insight = require('bitcore-insight').Insight
const axios = require('axios')

// const bitcore = require('bitcore-lib');
// const Insight = require('bitcore-insight').Insight;

const someWallet = async () => {
    //Define the network
    const network = bitcoin.networks.bitcoin
    // use networks.testnet for testnet

    // Derivation path
    const path = `m/44'/0'/0'/0`
    // Use `m/44'/1'/0'/0
    // Use `m/49'/1'/0'/0

    const mmemonic = await bip39.generateMnemonic()
    const seed = await bip39.mnemonicToSeed(mmemonic)
    const root = bip32.fromSeed(seed, network)

    const account = root.derivePath(path)
    const node = account.derive(0).derive(0)

    const btcAddress = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: network
    }).address

    const segwitAddress = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({pubkey: node.publicKey, network: network}),
        network: network
    }).address;
    console.log(`SegWit address: ${segwitAddress}`);

    console.log(`
        Wallet generated:
        - Address: ${btcAddress}
        -Private Key: ${node.toWIF()},
        - Mmemonic: ${mmemonic},
        - Seed: ${seed},
        - Public Key: ${node.publicKey}
    `)

}

const createWallet = () => {
    const wallet = new coinkey.createRandom()
    console.log(`Private key: ${wallet.privateKey.toString('hex')}`)
    console.log(`Address: ${wallet.publicAddress}`)
}

const generateWallet = async () => {
    const privateKey = new bitcore.PrivateKey()
    const address = privateKey.toAddress()
    console.log(`
        Wallet generated:
        - Address: ${address}
        -Private Key: ${privateKey}
    `)
    return {
        address,
        privateKey
    }
}


const sendBitcoin = async (receiverAddress, amountToSend) => {
    const sochainNetwork = "BTCTEST"; // the Testnet network for sochain
    const getWallet = await generateWallet()
    //const privateKey = getWallet.privateKey
    const privateKey = '93F2mUJPKbXW8Q9cMNz4ZmpsjgTbNjrMeCaUesTPE7k1DFhSmnk'
    //const sourceAddress = getWallet.address
    const sourceAddress = 'mtVE8anM63kQcgKUC6oQQD9K6xiV4wsr7q'
    // We are sending in Satoshi. so we convert amount to send to satoshi by multiplying by 100,000,000
    const satoshiToSend = amountToSend * 100000000; 
    let fee = 0
    let inputCount = 0
    let outputCount = 2 // 2 because we are sending to the receiver and getting our change back

    const utxos = await axios.get(`https://sochain.com/api/v2/get_tx_unspent/${sochainNetwork}/${sourceAddress}`)
    const transaction = new bitcore.Transaction()

    let totalAmountAvailable = 0
    let inputs = []
    utxos.data.data.txs.forEach(async (element) => {
        let utxo = {}
        utxo.satoshis = Math.floor(Number(element.value) * 100000000)
        utxo.script = element.script_hex
        utxo.address = utxos.data.data.address
        utxo.txId = element.txid
        utxo.outputIndex = element.output_no

        totalAmountAvailable += utxo.satoshis
        inputCount += 1
        inputs.push(utxo)
    })

    transactionSize = inputCount * 146 + outputCount * 34 + 10 - inputCount;
    fee = transactionSize * 20
    if(totalAmountAvailable - satoshiToSend - fee < 0) throw new Error("Balance is too low for this transaction")

    transaction.from(inputs)
    transaction.to(receiverAddress, satoshiToSend)
    transaction.change(sourceAddress)
    transaction.fee(fee * 20)
    transaction.sign(privateKey)
    const serializedTxn = transaction.serialize()

     // broadcast transaction
    const result = await axios({
        method: "POST",
        url: `https://sochain.com/api/v2/send_tx/${sochainNetwork}`,
        data: {
        tx_hex: serializedTxn,
        },
    });
    return result.data.data
}

const transferBTC = (receiverAddress, amount) => {
    let insight = new Insight('testnet')
    // // Our private key and address
    // const wif = 'xBtatQED9H44gCmp6HAdmemAzU3n84H3dGkuWTKvE23JgHMW8gct';
    // const privateKey = new bitcore.PrivateKey(wif);
    // const myAddress = privateKey.toAddress();
    const privateKey = '93F2mUJPKbXW8Q9cMNz4ZmpsjgTbNjrMeCaUesTPE7k1DFhSmnk'
    const sourceAddress = 'mtVE8anM63kQcgKUC6oQQD9K6xiV4wsr7q'

    // Start the creating our transaction
    sendingAmount = amount * 100000000
    const fee = 5000

    // Get the UTXO of your bitcoin address
    insight.getUtxos(sourceAddress, (err, utxos) => {
        if(err) {
            // Handle errors
            return err
        }
        else{
            // use thr UTXO to create txn with a bitcore transaction object
            let txn = bitcore.Transaction()
            txn.from(utxos)
            txn.to(receiverAddress)
            txn.change(sourceAddress)
            txn.fee(fee)
            txn.sign(privateKey)
            txn.serialize()

            insight.broadcast(txn.toString(), (error, txnid) => {
                if(error){
                    return error
                }
                // Your transaction Id
                return txnid
            })
        }
    })
}

// let insight = new Insight('testnet');

// // Our private key and address
// const wif = 'xBtatQED9H44gCmp6HAdmemAzU3n84H3dGkuWTKvE23JgHMW8gct';
// const privateKey = new bitcore.PrivateKey(wif);
// const myAddress = privateKey.toAddress();

// // Address we are sending Bitcoin to
// const addressTo = 'moCEHE5fJgb6yHtF9eLNnS52UQVUkHjnNm';

// // Start the creating our transaction
// const amount = 50000; // Sending amount must be in satoshis
// const fee = 50000; // Fee is in satoshis

// // Get the UTXOs of your Bitcoin address
// insight.getUtxos(myAddress, (err, utxos) => {
//         if(err){ 
//           //Handle errors
//           return err;
//         }else { 
//             // Use the UTXOs to create transaction with a
//             // bitcore Transaction object
//             let tx = bitcore.Transaction();
//             tx.from(utxos);
//             tx.to(addressTo, amount);
//             tx.change(myAddress);
//             tx.fee(fee);
//             tx.sign(privateKey);
//             tx.serialize();
            
//             // Broadcast your transaction to the Bitcoin network
//             insight.broadcast(tx.toString(), (error, txid) => {
//                 if (error) {
//                     return error;
//                 } else {
//                   // Your Transaction Id
//                     console.log(txid)
//                 }
//             })
//         }
// });


const sendMoney = () => {
    const key = bitcoin.ECKey.fromWIF("L1Kzcyy88LyckShYdvoLFg1FYpB5ce1JmTYtieHrhkN65GhVoq73");
    console.log(key)
}


// someWallet()
// createWallet()
// generateWallet()
// console.log(transferBTC("mtVE8anM63kQcgKUC6oQQD9K6xiV4wsryq", 0.0003))
sendMoney()
