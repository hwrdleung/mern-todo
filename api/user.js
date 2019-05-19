const User = require('../models/user');
const Task = require('../models/task');
const express = require('express');
const app = express();
const ServerResponse = require('./serverResponse');
const verifyToken = reuqire('./verifyToken)');

// All end points here should require JWT verification

// Create a new task
app.post('/create-task', verifyToken, (req, res) => {
    // Find user in database
    User.findOne({_id: req._id}).then(user => {
        if(!user) {
            res.json(new ServerResponse(false, 'User not found.'));
            throw('User not found.')
        } else {
            // Add new task to users's task[] with data in req.body.task
            user.tasks.push(new Task({
                creationDate: new Date(),
                dueDate: req.body.task.dueDate,
                subject: req.body.task.subject,
                body: req.body.task.body,
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
app.delete('/delete-task', verifyToken, (req, res) => {
    // Find user in database
    User.findOne({_id: req._id}).then(user => {
        if (!user) {
            res.json(new ServerResponse(false, 'User not found.'));
            throw ('User not found.');
        } else {
        // Find task by taskID
        for(let i = 0; i < user.tasks.length - 1; i++){
            if(user.tasks[i]._id === req.body.task._id){
                user.tasks[i].splice(i, 1);
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
app.put('/modify-task', verifyToken, (req, res) => {
      // Find user in database
      User.findOne({_id: req._id}).then(user => {
        if (!user) {
            res.json(new ServerResponse(false, 'User not found.'));
            throw ('User not found.');
        } else {
        // Find task by taskID
        for(let i = 0; i < user.tasks.length - 1; i++){
            if(user.tasks[i]._id === req.body.task._id){
                user.tasks[i] = req.body.task;
                break;
            }
        }
        return user.save();
    }
    }).then(user => {
        res.json(new ServerResponse(true, 'Task deleted.', user));
    }).catch(error => console.log(error));
});

// Toggle task completion
app.put('/toggle-completion', verifyToken, (req, res) => {
    let task = req.body.task

    User.findOne({ _id: req._id }).then(user => {
        if (!user) {
            res.json(new ServerResponse(false, 'User not found.'));
            throw ('User not found.');
        } else {
            for (let i = 0; i < user.tasks.length; i++) {
                if (user.tasks[i]._id === task._id) {
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

app.get('/get-user-data', verifyToken, (req, res) => {
    User.findOne({ _id: req._id }).then(user => {
        if (!user) {
            res.json(new ServerResponse(false, 'User not found.'));
            throw ('User not found.');
        } else {
            res.json(new ServerResponse(true, `Returning user data.`, user));
        }
    }).catch(error => console.log(error));
});

