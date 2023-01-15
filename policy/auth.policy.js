const Joi = require("joi");

const login = {
    body: Joi.object().keys({
      email: Joi.string().required().messages({
        "string.empty": `Email cannot be an empty field`,
        "any.required": `Email is a required field`,
      }),
      password: Joi.string().required().messages({
        "string.empty": `Password cannot be an empty field`,
        "any.required": `Password is a required field`,
      })
    })
}

const confirmAccount = {
    body: Joi.object().keys({
      email: Joi.string().required().messages({
        "string.empty": `Email cannot be an empty field`,
        "any.required": `Email is a required field`,
      }),
      pin: Joi.string().required().messages({
        "string.empty": `Pin cannot be an empty field`,
        "any.required": `Pin is a required field`,
      })
    })
}

const register = {
    body: Joi.object().keys({
      firstname: Joi.string().required().messages({
        "string.empty": `First Name cannot be an empty field`,
        "any.required": `First Name is a required field`,
      }),
      lastname: Joi.string().required().messages({
        "string.empty": `Last Name cannot be an empty field`,
        "any.required": `Last Name is a required field`,
      }),
      password: Joi.string().required().messages({
        "string.empty": `Password cannot be an empty field`,
        "any.required": `Password is a required field`,
      }),
      email: Joi.string().required().messages({
        "string.empty": `Email cannot be an empty field`,
        "any.required": `Email is a required field`,
      }),
      phonenumber: Joi.string().required().messages({
        "string.empty": `phoneNumber cannot be an empty field`,
        "any.required": `phoneNumber is a required field`,
      })
    }),
}

const resetPassword = {
    body: Joi.object().keys({
      token: Joi.string().required().messages({
        "string.empty": `token cannot be an empty field`,
        "string.min": `token should have a minimum length of {#limit}`,
        "string.max": `token should have a maximum length of {#limit}`,
        "any.required": `token is a required field`,
      }),
      newPassword: Joi.string().min(8).max(20).required().messages({
        "string.empty": `newPassword cannot be an empty field`,
        "string.min": `New Password should have a minimum length of {#limit}`,
        "string.max": `New Password should have a maximum length of {#limit}`,
        "any.required": `newPassword is a required field`,
      })
    }),
}
  
  const updatePassword = {
    body: Joi.object().keys({
      newPassword: Joi.string().min(8).max(20).required().messages({
        "string.empty": `New Password cannot be an empty field`,
        "string.min": `New Password should have a minimum length of {#limit}`,
        "string.max": `New Password should have a maximum length of {#limit}`,
        "any.required": `New Password is a required field`,
      }),
      oldPassword: Joi.string().required().messages({
        "string.empty": `Old Password cannot be an empty field`,
        "string.min": `New Password should have a minimum length of {#limit}`,
        "string.max": `New Password should have a maximum length of {#limit}`,
        "any.required": `Old Password is a required field`,
      }),
    }),
}

const updateUser = {
    body: Joi.object().keys({
      firstName: Joi.string().required().messages({
        "string.empty": `First Name cannot be an empty field`,
        "any.required": `First Name is a required field`,
      }),
      lastName: Joi.string().required().messages({
        "string.empty": `Last Name cannot be an empty field`,
        "any.required": `Last Name is a required field`,
      }),
      phoneNumber: Joi.string().required().messages({
        "string.empty": `phoneNumber cannot be an empty field`,
        "any.required": `phoneNumber is a required field`,
      })
    })
}

module.exports = {
    register,
    login,
    resetPassword,
    updateUser,
    confirmAccount,
    updatePassword
}