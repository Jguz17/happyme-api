const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../middleware/auth")

const GratitudeItem = require("../models/GratitudeItem")

// @route     POST api/gratitudeItem
// @desc      Add new gratitudeItem
// @access    Private

router.post("/", [
    auth, [
        check("content", "You can only enter a max of 140 characters").isLength({ max: 140})
        ]
    ], async (req, res) => {

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

// @route     GET api/gratitudeItems
// @desc      Get all users gratitudeItems
// @access    Private

router.get("/", auth, async (req, res) => {
    try {
        const gratitudeItems = await GratitudeItem.find({ user: req.user.id }).sort({ date: -1 })

        res.json(gratitudeItems)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');   
    }
})

// @route     DELETE api/gratitudeItem/:id
// @desc      Delete all users gratitudeItems
// @access    Private

router.delete("/:id", auth, async (req, res) => {
    try {
        let gratitudeItem = await GratitudeItem.findById(req.params.id)

        if (!gratitudeItem) return res.status(400).res.json({
            message: "Gratitude Item not found"
        })

        // Make sure user owns Gratitude Item
        if (gratitudeItem.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized'})
        }        

        await GratitudeItem.findByIdAndRemove(req.params.id)

        res.json({msg: 'Gratitude item removed'})
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');    
    }
})

module.exports = router