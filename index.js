require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

// Connect to database
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser : true})
.then(() => console.log('Connected to database.'))
.catch(error => console.log(error));

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

// Routes 
app.use(express.static(path.join(__dirname, '/client/build')))
app.use(express.static(path.join(__dirname, '/api')))
app.use('/api/user', require('./api/user'));
app.use('/api/auth', require('./api/auth'));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, "/client/build/index.html")));

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));