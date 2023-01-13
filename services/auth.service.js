const { User, Token } = require("../models");
const bcrypt = require("bcryptjs");
const ApiError = require("../helpers/ApiError");
const jwt = require("jsonwebtoken");

const register = async (data) => {
    try {
        let user = await User.findOne({ email: data.email });
        if(user) {
            const err = {
                code: 400,
                message: "A user with this email already exist"
            };
            throw err;
        }
        data.password = await bcrypt.hash(data.password, 10);
        const newUser = await User.create(data);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);   
    }
}

const login = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if(!user) throw new ApiError(400, "Invalid email or password");
        if(!user.accountconfirmed) throw new ApiError(400, "Account not activated");
        await comparePassword(password, user);
        return user;
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

const comparePassword = async (password, user) => {
    try {
        const result = await bcrypt.compare(password, user.password);
        if(!result) throw new ApiError(400, "Invalid email or password");
        return result;
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

const getUsers = async (criteria = {}, options = {}) => {
    try {
        const { sort = { createdAt: -1 }, limit, page } = options;
        const _limit = parseInt(limit, 10);
        const _page = parseInt(page, 10);
        const users = await User.find(criteria)
        .sort(sort)
        .limit(_limit)
        .skip(_limit * (_page - 1));
        return { users, page: _page};
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

const getUserByEmail = async(email) => {
    try {
        const user = await User.findOne({ email });
        if(!user) throw new ApiError(400, "Invalid user");
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

const getUserById = async (_id) => {
    try {
        const user = await User.findOne({ _id });
        if(!user) throw new ApiError(400, "Invalid user");
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

const validateToken = (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if(!bearerHeader) throw new ApiError(400, "You need to attach a token");
    const bearer = bearerHeader.split(" ");
    const [, token] = bearer;
    req.token = token;
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if(err) {
            const errorCode = err.code || 500;
            const errorMessage = err.message || err;
            return res.status(errorCode).send({
                message: `${errorMessage}`
            })
        }
        else {
            req.user = authData.user; 
            next;
        }
    })
}

const updateUserById = async (userId, updateBody) => {
    try {
        const user = await User.findById(userId);
        if(!user) throw new ApiError(400, "User not found");
        Object.assign(user, updateBody);
        await user.save();
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

const emailVerification = async (data) => {
    try {
        let user = await User.findOne({ email: data.email, pin: data.pin })
        if (!user) throw new ApiError(400, "Invalid user")
        user = await updateUserById(user._id, { accountconfirmed: true, status: "Active" })
        return user
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

const resetPassword = async (token, newPassword) => {
    try {
        var response = await tokenService.verifyTokenResetPassword(token, "resetPassword")
        if (!response) throw new ApiError(400, "Password reset failed. Incorrect token")
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        const updateUser = await updateUserById(response.sub, {
            password: hashedPassword
        })
        return updateUser
    } catch (error) {
        console.log(error)
        throw new ApiError(
            400,
            (error && error.message) || "Password reset failed"
        )
    }
}

const updatePassword = async (email, oldPassword, newPassword) => {
    try {
        const user = await User.findOne({ email })
        if (!user) throw new ApiError(400, "Invalid email or password")
        const verifyUser = await comparePassword(oldPassword, user)
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await updateUserById(user.id, { password: hashedPassword })
    } catch (error) {
        throw new ApiError(
            400,
            (error && error.message) || "Password reset failed"
        );
    }
}

const count = async (criteria = {}) => {
    return await User.find(criteria).countDocuments();
}

module.exports = {
    register,
    login,
    getUsers,
    getUserByEmail,
    getUserById,
    validateToken,
    updateUserById,
    emailVerification,
    resetPassword,
    updatePassword,
    count
}