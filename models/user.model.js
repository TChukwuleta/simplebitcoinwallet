const mongoose = require("mongoose");
const moment = require("moment");

const schema = mongoose.Schema;

const userSchema = new schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        trim: true
    },
    privatekey: {
        type: String,
        trim: true
    },
    publickey: {
        type: String,
        trim: true
    },
    accountconfirmed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Deactivated"],
        default: "Inactive"
    },
    createdAt: {
        type: String,
        default: moment().format(),
    },
    updatedAt: {
        type: String,
        default: moment().format(),
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User