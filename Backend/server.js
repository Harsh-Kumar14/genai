// require("dotenv").config()
// const app = require("./src/app")
// const connectToDB = require("./src/config/database")

// connectToDB()


// app.listen(3000, () => {
//     console.log("Server is running on port 3000")
// })

require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

// Keep Render free tier alive (pings every 14 minutes to prevent cold start)
setInterval(() => {
    fetch("https://resume-analyzer-ar5m.onrender.com/")
        .catch(() => {}) // silently ignore errors
}, 14 * 60 * 1000)