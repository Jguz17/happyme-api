const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")

const User = require("../models/User")

router.post("/", [
    check("username", "Please add username").not().isEmpty(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { username, password } = req.body

    try {
        let user = await User.findOne({ username })

        if (user) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        user = new User({
            username,
            password
        })

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)

        await user.save()

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get("jwtSecret"), {
            expiresIn: 36000
        }, (error, token) => {
            if (error) throw error
            res.json({ token })
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
    }
})

module.exports = router