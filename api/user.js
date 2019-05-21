const User = require('../models/user');
const TaskSchema = require('../models/task');
const mongoose = require('mongoose');
const Task = mongoose.model('Task', TaskSchema);
const express = require('express');
const router = express.Router();
const ServerResponse = require('./serverResponse');
const verifyToken = require('./verifyToken');

// All end points here should require JWT verification

// Create a new task
router.post('/create-task', verifyToken, (req, res) => {
    // Find user in database
    User.findOne({ _id: req._id }).then(user => {
        if (!user) {
            res.json(new ServerResponse(false, 'User not found.'));
            throw ('User not found.')
        } else {
            // Add new task to users's task[] with data in req.body.task
            user.tasks.push(new Task({
                creationDate: new Date(),
                dueDate: req.body.dueDate,
                subject: req.body.subject,
                body: req.body.body,
                completed: false
            }))

            return user.save();
        }
    }).then(user => {
        // Return user to client
        res.json(new ServerResponse(true, `New task saved successfully.`, user));
    }).catch(error => console.log(error));
});

// Delete a task
router.post('/delete-task', verifyToken, (req, res) => {
    // Find user in database
    User.findOne({ _id: req._id }).then(user => {
        if (!user) {
            res.json(new ServerResponse(false, 'User not found.'));
            throw ('User not found.');
        } else {
            // Find task by taskID
            for (let i = 0; i < user.tasks.length; i++) {
                if (user.tasks[i]._id.equals(req.body._id)) {
                    user.tasks.splice(i, 1);
                    break;
                }
            }
            return user.save();
        }
    }).then(user => {
        res.json(new ServerResponse(true, 'Task deleted.', user));
    }).catch(error => console.log(error));
});

// Modify a task
router.put('/modify-task', verifyToken, (req, res) => {
    // Find user in database
    User.findOne({ _id: req._id }).then(user => {
        if (!user) {
            res.json(new ServerResponse(false, 'User not found.'));
            throw ('User not found.');
        } else {
            // Find task by taskID
            for (let i = 0; i < user.tasks.length; i++) {
                if (user.tasks[i]._id.equals(req.body.taskId)) {
                    console.log('task found')
                    user.tasks[i] = {...user.tasks[i],
                        ... {
                            creationDate: req.body.creationDate,
                            dueDate: req.body.dueDate,
                            body: req.body.body,
                            subject: req.body.subject,
                            completed: req.body.completed
                        }
                    };
                    break;
                }
            }
            return user.save();
        }
    }).then(user => {
        res.json(new ServerResponse(true, 'Task modified.', user));
    }).catch(error => console.log(error));
});

// Toggle task completion
router.put('/toggle-completion', verifyToken, (req, res) => {

    User.findOne({ _id: req._id }).then(user => {
        if (!user) {
            res.json(new ServerResponse(false, 'User not found.'));
            throw ('User not found.');
        } else {
            for (let i = 0; i < user.tasks.length; i++) {
                if (user.tasks[i]._id.equals(req.body._id)) {
                    user.tasks[i].completed = !user.tasks[i].completed;
                    break;
                }
            }
            return user.save();
        }
    }).then(user => {
        return res.json(new ServerResponse(true, 'Toggled completion', user));
    }).catch(error => console.log(error));
});

router.get('/get-user-data', verifyToken, (req, res) => {
    User.findOne({ _id: req._id }).then(user => {
        if (!user) {
            res.json(new ServerResponse(false, 'User not found.'));
            throw ('User not found.');
        } else {
            res.json(new ServerResponse(true, `Returning user data.`, user));
        }
    }).catch(error => console.log(error));
});

module.exports = router;