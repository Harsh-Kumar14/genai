require("dotenv").config()
const https = require("https")
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


setInterval(() => {
    https.get("https://genai-e60a.onrender.com/", (res) => {
        console.log(`Keep-alive ping: ${res.statusCode}`)
    }).on("error", () => {
       
    })
}, 14 * 60 * 1000)