const Joi = require('joi')

const mnemonicBody = {
    body: Joi.object().keys({
        mnemonic: Joi.string().required().messages({
            "string.empty": `mnemonic cannot be an empty field`,
            "any.required": `mnemonic is a required field`,
          })
    })
}

const publicKeyBody = {
    body: Joi.object().keys({
        publickey: Joi.string().required().messages({
            "string.empty": `publickey cannot be an empty field`,
            "any.required": `publickey is a required field`,
          })
    })
}


module.exports = {
    mnemonicBody,
    publicKeyBody
}