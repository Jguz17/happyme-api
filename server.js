const express = require("express")
const connectDB = require("./config/db")
const cors = require("cors")

const app = express()

connectDB()

app.use(express.json());
app.use(cors({origin:true,credentials: true}));

app.use("/api/users", require("./routes/users"))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`)
})