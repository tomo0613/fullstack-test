module.exports = (filter, middleware) => {
    return function(req, res, next) {
        //TODO filter path / regex
        // console.log('req.path: ', req.path);
        // console.log('req.method: ', req.method);
        if (filter.method === req.method) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};
