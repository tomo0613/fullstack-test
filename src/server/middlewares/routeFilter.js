module.exports = (filter, middleware) => {
    return function(req, res, next) {
        //TODO filter req.path as well -> filter={path|method: path ? str|regex : str}
        if (filter.method === req.method) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};
