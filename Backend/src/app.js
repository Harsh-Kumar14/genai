const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "https://resume-analyzer-8xzj.vercel.app",
    credentials: true
}))
// const corsOptions = {
//     origin: "https://resume-analyzer-8xzj.vercel.app",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }

// app.use(cors(corsOptions))
// app.options("*", cors(corsOptions))  // ← handles preflight

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app