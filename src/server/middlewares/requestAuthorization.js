const jwt = require('jsonwebtoken');
const routeFilter = require('./routeFilter');

module.exports = (props) => {
    const requestAuthorization = (request, response, next) => {
        const token = request.headers.authorization;
        if (token) {
            jwt.verify(token, props.secret, (err, decodedPayload) => {
                if (err) {
                    console.error(err);
                    response.json({message: 'error@authenticationFailed.probablyBadToken'});
                } else if (props.roles.indexOf(decodedPayload.role) === -1) {
                    response.json({message: 'warning@permissionNeeded'});
                } else {
                    next();
                }
            });
        } else {
            response.json({message: 'error@noTokenProvided.tryToSignIn'});
        }
    };
    requestAuthorization.filter = (filter) => routeFilter(filter, requestAuthorization);

    return requestAuthorization;
};
