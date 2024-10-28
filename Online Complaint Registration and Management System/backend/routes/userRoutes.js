// routes/userRoutes.js
const express = require('express');
const { signupUser, loginUser } = require('../controllers/userController');
const router = express.Router();

// Routes
router.post('/signup', signupUser);
router.post('/login', loginUser);

module.exports = router;
