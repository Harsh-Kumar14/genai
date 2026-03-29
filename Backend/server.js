require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()


// app.listen(3000, () => {
//     console.log("Server is running on port 3000")
// })
if (process.env.NODE_ENV !== "production") {
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
}

module.exports = app