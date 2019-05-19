const User = require('../models/user');
const express = require('express');
const ServerResponse = require('./serverResponse');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        let newUser = new User({
            firstName: req.body.user.firstName,
            lastName: req.body.user.lastName,
            username: req.body.username,
            email: req.body.email,
            password: hash,
            tasks: []
        })

        return newUser.save();
    }).then(user => {
        if(!user){
            res.json(new ServerResponse(false, 'Registration unsuccessful.'));
            throw('Registrsation unsuccessful');
        } else {
            res.json(new ServerResponse(true, 'Registration successful', user));
        }
    }).catch(error => console.log(error));
});

app.post('/login', (req, res) => {
    User.findOne({username: req.body.username}).then(user => {
        if(!user) {
            res.json(new ServerResponse(false, 'User not found.'));
            throw('User not found');
        } else {
            // Compare passwords
            return bcrypt.compareSync(req.body.password, user.password);
        }
    }).then(isValid => {
        if(!isValid) { // Invalid password, return server message
            res.json(new ServerResponse(false, 'Invalid password.'));
            throw('Invalid password');
        } else { // Valid password, return token and user data
            res.json(new ServerResponse(true, 'Authentication successful.', {
                user: user,
                token : jwt.sign({_id: user._id}, process.env.SECRET)
            }));
        }
    }).catch(error => console.log(error));
});

