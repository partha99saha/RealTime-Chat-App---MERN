exports.serverErrorHandler = (err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({ message: message, data: data });
};

exports.pageNotFoundError = (err, req, res, next) => {
    console.log(err);
    const status = err.status || 404;
    const message = err.message;
    const data = err.data;
    res.status(status).json({ message: message, data: data });
};