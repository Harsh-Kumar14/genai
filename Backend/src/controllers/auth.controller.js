// const userModel = require("../models/user.model")
// const bcrypt = require("bcryptjs")
// const jwt = require("jsonwebtoken")
// const validate=require("../utils/validator")
// const tokenBlacklistModel = require("../models/blacklist.model")

// async function registerUserController(req, res) {

//         try {

//             validate(req.body);
//             const { username, email, password } = req.body;

//             req.body.password = await bcrypt.hash(password, 10);
//             const user = await userModel.create(req.body);

//             const token = jwt.sign({ _id: user._id, email, username }, process.env.JWT_SECRET, { expiresIn: 60*60 });

//             const reply={
//                     username:user.username,
//                     email:user.email,
//                     _id:user._id,
//             }
//             res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

//             res.status(201).json({
//                 user:reply,
//                 message:"User registered successfully"
//             });  
//         } 
//         catch (err) {
//             console.error("Registration error:", err);
//             res.status(400).json({ error: err.message || "Unknown error" });
//         }

// }


// async function loginUserController(req, res) {

//         try{
//                 const {email,password}=req.body;
//                 if(!email)
//                    throw new Error("Invalid Credentials");
//                 if(!password)
//                    throw new Error("Invalid Credentials");

//                 const user= await userModel.findOne({ email });

//                 if(!user)
//                   throw new Error("Invalid Credentials");

//                 const match=await bcrypt.compare(password,user.password);

//                 if(!match)
//                   throw new Error("Invalid Credentials");

//                 const reply={
//                     username:user.username,
//                     email:user.email,
//                     _id:user._id,
//                 }

//                 const token=jwt.sign({_id:user._id,email,username:user.username},process.env.JWT_SECRET,{expiresIn:60*60});
//                 res.cookie('token',token,{maxAge:60*60*1000});

//                 res.status(201).json({
//                     user:reply,
//                     message:"Login Successfully"
//                 });  
//         }
//         catch(err){
//                 res.status(401).json({ error: err.message || "Invalid Credentials" });
//         }
// }


// async function logoutUserController(req, res) {
//     try {
//         const token = req.cookies.token;

//         if (token) {
//             await tokenBlacklistModel.create({ token });
//         }

//         res.cookie("token", null, { expires: new Date(0) });
//         res.status(200).send("Logged out successfully");
//     } 
//     catch (err) {
//         console.error("Logout error:", err.message);
//         res.status(503).send("Error: " + err.message);
//     }
// }

// async function getMeController(req, res) {

//     try{
//         const userId = req.user._id;
//         const user= await userModel.findById(userId).select('-password -__v');

//         if(!user) return res.status(404).json({error: "User not found"});

//         res.status(200).json({
//             message: "User details fetched successfully",
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email
//             }
//         })
//     }
//     catch(err){
//         res.status(400).json({error: "Error fetching profile", details: err.message});
//     }

// }



// module.exports = {
//     registerUserController,
//     loginUserController,
//     logoutUserController,
//     getMeController
// }


const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const validate = require("../utils/validator")
const tokenBlacklistModel = require("../models/blacklist.model")

// Cookie options required for cross-origin (Vercel frontend <-> Render backend)
const cookieOptions = {
    httpOnly: true,      // JS cannot access the cookie (XSS protection)
    secure: true,        // Only sent over HTTPS
    sameSite: "none",    // Required for cross-origin cookie sending
    maxAge: 60 * 60 * 1000  // 1 hour in milliseconds
}

async function registerUserController(req, res) {
    try {
        validate(req.body);
        const { username, email, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        const user = await userModel.create(req.body);

        const token = jwt.sign(
            { _id: user._id, email, username },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 }
        );

        const reply = {
            username: user.username,
            email: user.email,
            _id: user._id,
        }

        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            user: reply,
            message: "User registered successfully"
        });
    }
    catch (err) {
        console.error("Registration error:", err);
        res.status(400).json({ error: err.message || "Unknown error" });
    }
}


async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email)
            throw new Error("Invalid Credentials");
        if (!password)
            throw new Error("Invalid Credentials");

        const user = await userModel.findOne({ email });

        if (!user)
            throw new Error("Invalid Credentials");

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            throw new Error("Invalid Credentials");

        const reply = {
            username: user.username,
            email: user.email,
            _id: user._id,
        }

        const token = jwt.sign(
            { _id: user._id, email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 }
        );

        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            user: reply,
            message: "Login Successfully"
        });
    }
    catch (err) {
        res.status(401).json({ error: err.message || "Invalid Credentials" });
    }
}


async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token;

        if (token) {
            await tokenBlacklistModel.create({ token });
        }

        // Clear the cookie with same options (sameSite + secure must match)
        res.cookie("token", null, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: new Date(0)
        });

        res.status(200).send("Logged out successfully");
    }
    catch (err) {
        console.error("Logout error:", err.message);
        res.status(503).send("Error: " + err.message);
    }
}

async function getMeController(req, res) {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).select('-password -__v');

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    }
    catch (err) {
        res.status(400).json({ error: "Error fetching profile", details: err.message });
    }
}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}