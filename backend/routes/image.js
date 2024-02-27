const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const { v4: uuidv4 } = require("uuid");
const path = require('path');
const Image = require('../models/imagemodels');

// Set up multer storage and file filter
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage, fileFilter });

// Get All the Images
router.get('/fetchallimages', fetchuser, async (req, res) => {
    try {
        const images = await Image.find({ user: req.user.id });
        res.json(images);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Add a New Image
router.post('/addimages', fetchuser, upload.single('images'), async (req, res) => { 
    try {
        const { images } = req.body;
        const newImage = new Image({
            image: req.file.filename,
            user: req.user.id
        });
        const savedImage = await newImage.save();
        res.json(savedImage);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occurred");
    }
});

module.exports = router;
