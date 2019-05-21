const User = require('../models/user');
const express = require('express');
const ServerResponse = require('./serverResponse');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', (req, res) => {
    // Check for existing accounts with this username or email address
    Promise.all([
        User.findOne({ username: req.body.username }),
        User.findOne({ email: req.body.emailAddress })
    ]).then(results => {
        if (results[0]) {
            res.json(new ServerResponse(false, 'This email address has already been used to create an account.'));
            throw ('Registration unsuccessful.  Email address is in use.');
        } else if (results[1]) {
            res.json(new ServerResponse(false, 'This username is already in use.'));
            throw ('Registration unsuccessful.  Username is in use.');
        } else {
            return bcrypt.hash(req.body.password, 10);
        }
    }).then(hash => {
        // Hash password and create new user acccount
        let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            emailAddress: req.body.emailAddress,
            password: hash,
            tasks: []
        })

        return newUser.save();
    }).then(user => {
        if (!user) {
            res.json(new ServerResponse(false, 'Registration unsuccessful.'));
            throw ('Registrsation unsuccessful');
        } else {
            res.json(new ServerResponse(true, 'Registration successful', {
                user: user,
                token: jwt.sign({ _id: user._id }, process.env.SECRET)
            }));
        }
    }).catch(error => console.log(error));
});

router.post('/login', (req, res) => {
    let user = null;

    User.findOne({ username: req.body.username }).then(data => {
        if (!data) {
            res.json(new ServerResponse(false, 'User not found.'));
            throw ('User not found');
        } else {
            // Compare passwords
            user = data;
            return bcrypt.compareSync(req.body.password, user.password);
        }
    }).then(isValid => {
        if (!isValid) { // Invalid password, return server message
            res.json(new ServerResponse(false, 'Invalid password.'));
            throw ('Invalid password');
        } else { // Valid password, return token and user data
            res.json(new ServerResponse(true, 'Authentication successful.', {
                user: user,
                token: jwt.sign({ _id: user._id }, process.env.SECRET)
            }));
        }
    }).catch(error => console.log(error));
});

module.exports = router;