const express = require('express')

const successResponse = (res, status, msg, data) => {
    const result = {
        msg,
        data
    }
    return res.status(status).send(result)
}

const errorResponse = (res, status, msg) => {
    const result = {
        msg
    }
    res.status(status).send(result)
}

module.exports = {
    successResponse,
    errorResponse
}