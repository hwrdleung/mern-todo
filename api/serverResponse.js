const ServerResponse = (success, message, payload) => {
    return {
        success : success,
        message : message,
        payload : payload
    }
}

module.exports = ServerResponse;