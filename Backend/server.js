// require("dotenv").config()
// const app = require("./src/app")
// const connectToDB = require("./src/config/database")

// connectToDB()


// app.listen(3000, () => {
//     console.log("Server is running on port 3000")
// })

require("dotenv").config()
const https = require("https")
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

// Keep Render free tier alive — works on all Node versions (no fetch needed)
setInterval(() => {
    https.get("https://resume-analyzer-ar5m.onrender.com/", (res) => {
        console.log(`Keep-alive ping: ${res.statusCode}`)
    }).on("error", () => {
        // silently ignore — server may still be waking up
    })
}, 14 * 60 * 1000)