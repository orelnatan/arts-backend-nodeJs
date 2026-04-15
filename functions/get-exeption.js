
function getExeption(response, status, message) {
    return response.status(status).send({
        status: status,
        message: message
    });
}

module.exports = getExeption;