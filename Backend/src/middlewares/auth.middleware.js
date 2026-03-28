const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklist.model");

const authUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) throw new Error("Token is not present");

        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isTokenBlacklisted) throw new Error("Token is invalid");

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = payload;
        if (!_id) throw new Error("Id is missing");

        const user = await userModel.findById(_id);
        if (!user) throw new Error("User does not exist");

        req.user = user;
        next();
    } catch (err) {
        console.error("Middleware Error:", err.message);
        res.status(401).json({ error: "Auth Error: " + err.message });
    }
};

module.exports = { authUser };
