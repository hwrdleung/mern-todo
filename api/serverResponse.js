function ServerResponse(success, message, body) {
    return {
        success: success,
        message: message,
        body: body
    }
}

module.exports = ServerResponse;