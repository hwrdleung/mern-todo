const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    creationDate: {type: Date, required: true},
    dueDate: {type: Date, required: true},
    subject: {type: String, required: true},
    body: {type: String, required: false},
    completed: {type: Boolean, required: true}
});

module.exports = TaskSchema;