const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../middleware/auth")

const GratitudeItem = require("../models/GratitudeItem")

// @route     POST api/contacts
// @desc      Add new contact
// @access    Private

router.post("/", [
    auth, [
        check("content", "You can only enter a max of 140 characters").isLength({ max: 140})
        ]
    ], async (req, res) => {
    
        // const {name, email, phone, type} = req.body;
    
        // try {
        //   const newContact = new Contact({
        //     name,
        //     email,
        //     phone,
        //     type,
        //     user: req.user.id,
        //   });
    
        //   const contact = await newContact.save();
    
        //   res.json(contact);

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const { content } = req.body

        try {
            const newGratitudeItem = new GratitudeItem({
                content,
                user: req.user.id
            })

            const gratitudeItem = await newGratitudeItem.save()

            res.json(gratitudeItem)
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
)

module.exports = router