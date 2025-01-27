const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel.js');
const AuthRouter = express.Router();

// Base route, router to use
AuthRouter
    .route('/signup')
    .get(getSignup)
    .post(postSignup);

AuthRouter
    .route('/login')
    .get(getLogin)
    .post(postLogin);

function getSignup(req, res, next) {
    res.sendFile('../src/pages/signup.js', { root: __dirname });
    
}

async function postSignup(req, res) {
    try {
        let { username, email, password } = req.body;

        // Check if the user already exists
        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        // Create a new user
        user = new UserModel({
            username,
            email,
            password,
        });

        await user.save();
        res.status(201).json({ msg: 'User signed up successfully', data: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

function getLogin(req, res) {
    res.sendFile('../src/pages/login.js', { root: __dirname });
}

async function postLogin(req, res) {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate a JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            'your_jwt_secret', // Replace with your own secret
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

module.exports = AuthRouter;