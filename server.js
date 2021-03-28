const express = require("express")
const connectDB = require("./config/db")
const cors = require("cors")

const app = express()

connectDB()

app.use(express.json())

app.use(cors())

app.use("/api/users", require("./routes/users"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/gratitudeItem", require("./routes/gratitudeItem"))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`)
})