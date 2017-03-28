const jwt = require('jsonwebtoken');
const routeFilter = require('./routeFilter');

module.exports = (props) => {
    const requestAuthorization = (request, response, next) => {
        const token = request.headers.authorization;
        if (token) {
            jwt.verify(token, props.secret, (err, decodedPayload) => {
                if (err) {
                    console.error(err);
                    response.send('error@authenticationFailed.probablyBadToken');
                } else if (props.roles.indexOf(decodedPayload.role) === -1) {
                    response.send('warning@permissionNeeded');
                } else {
                    next();
                }
            });
        } else {
            response.send('error@noTokenProvided.tryToSignIn');
        }
    };
    requestAuthorization.filter = (filter) => routeFilter(filter, requestAuthorization);

    return requestAuthorization;
};
