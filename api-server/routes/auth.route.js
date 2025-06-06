const express = require('express');
const { signup, login, logout, verifyEmail } = require('../controllers/auth.controller');
const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail); 
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;