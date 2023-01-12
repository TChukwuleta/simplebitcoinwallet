const Cryptr = require('cryptr');
const dotenv = require("dotenv");
dotenv.config();

const cryptr = new Cryptr(process.env.ENCRYPT_SECRET);

const encryptKey = (data) => {
    const encryptedString = cryptr.encrypt(data);
    return encryptedString;
}

const decryptKey = (encrypteddata) => {
    const decryptedString = cryptr.decrypt(encrypteddata);
    return decryptedString;
}

module.exports = {
    encryptKey,
    decryptKey
}