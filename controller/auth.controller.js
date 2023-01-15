const ApiError = require("../helpers/ApiError");
const catchAsync = require("../helpers/catchAsync");
const pick = require("../helpers/pick");
const { User, Token } = require("../models");
const encryptMethod = require("../helpers/encryption");
const { tokenService, authService, bitcoinService } = require("../services");
require('dotenv').config();

const register = catchAsync(async (req, res) => {
    console.log(req.body);
    const token = Math.floor(1000 + Math.random() * 9000);
    console.log(`Token is: ${token}`);
    const mnemonic = await bitcoinService.generateMnemonic();
    const keys = await bitcoinService.generateMasterKeys(mnemonic);
    console.log(keys);
    const encryptedPrivateKey = encryptMethod.encryptKey(keys.xprv);
    const encryptedPublicKey = encryptMethod.encryptKey(keys.xpub);
    var userRequest = {
        ...req.body,
        pin: token.toString(),
        privatekey: encryptedPrivateKey,
        publickey: encryptedPublicKey,
        availableBalance: 0
    }
    const user = await authService.register(userRequest);
    const tokens = await tokenService.generateAuthTokens(user, true);
    res.status(201).send({
        message: "User registration was successful",
        data: {
            user,
            token: tokens.access.token
        }
    })
})

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body
    const user = await authService.login(email, password)
    const token = await tokenService.generateAuthTokens(user)
    res.status(201).send({
        message: "Login was successful",
        data: {
            user,
            token: token.access.token
        }
    })
})

const emailVerification = catchAsync(async (req, res) => {
    try {
        const user = await authService.emailVerification(req.body)
        delete user.password
        res.send({
            message: "Account activated successfully",
            user
        })
    } catch (error) {
        const message = error.message || error;
        const code = error.code || 500;
        throw new ApiError(code, message);
    }
})

const resetPassword = catchAsync(async (req, res) => {
    await authService.resetPassword(req.body.token, req.body.newPassword)
    res.status(200).send({
        message: "password reset successfully",
        data: {}
    })
})

const updatePassword = catchAsync(async (req, res) => {
    await authService.updatePassword(req.user.email, req.body.oldPassword, req.body.newPassword)
    res.status(200).send({
        message: "Password updated successfully",
        data: {}
    })
})

const updateUserById = catchAsync(async (req, res) => {
    if (req.body.password) throw new ApiError("You can't update your password here")
    const user = await authService.updateUserById(req.user._id, req.body)
    res.status(201).send({
        message: "User updated successfully",
        data: { user }
    })
})

const getUser = catchAsync(async (req, res) => {
    let user;
    if (req.query.user) {
        user = JSON.parse(JSON.stringify(await authService.getUserById(req.query.user)))
    } else {
        user = JSON.parse(JSON.stringify(await authService.getUserById(req.user._id)))
    }
    res.status(200).send({
        message: "User details fetched successfully",
        data: {
            user
        }
    })
})

const getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ["type"])
    const options = pick(req.query, ["sortby", "limit", "page"])
    const { users, page } = await authService.getUsers(JSON.parse(JSON.stringify(filter)), options)
    const count = await authService.count(filter)
    res.status(200).send({
        message: "Users fetched successfully",
        data: {
            count,
            currentPage: page,
            users
        }
    })
})

module.exports = {
    register,
    login,
    emailVerification,
    getUser,
    getUsers,
    resetPassword,
    updatePassword,
    updateUserById,
    getUser,
    getUsers,
}