require("dotenv").config();
const jwt = require('jsonwebtoken');
const ServerResponse = require('./serverResponse');

function verifyToken(req, res, next) {
    const token = req.header('x-auth-token');
    // Check for token
    if (!token)
        return res.json(new ServerResponse(false, 'Authentication failed.  No token.'));

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add user from payload
        req._id = decoded;
        next();
    } catch (e) {
        console.log('Authentication failed.  Invalid token.')
        res.json(new ServerResponse(false, 'Authentication failed.  Invalid token.'));
    }
}

module.exports = verifyToken;