const jwt = require('jsonwebtoken');

async function generalHandler(socket) {
    console.log("Connection Establish");
    // Get the JWT from the HTTP headers
    const token = socket.handshake.headers['token'];
    console.log(token);

    // Verify the JWT
    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
        if (err) {
            console.log(err);
            socket.disconnect();
        } else {
            console.log(decodedToken.user_id);
            if (decodedToken.user_id != null) {
                socket.emit('authenticated', { message: 'Hello, world!' });
                socket.on(`user-${decodedToken.user_id}`, (data) => {
                    console.log(data);
                    socket.emit(`user-${decodedToken.user_id}`, { message: 'Confirm' });
                });
            } else {
                socket.disconnect();
            }

        }
    });
}

module.exports = {
    generalHandler: generalHandler
}