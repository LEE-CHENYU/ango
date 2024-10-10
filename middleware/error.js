const errorHandler = (err, req, res, next) => {
    const errorDetails = {
        message: err.message,
        stack: err.stack,
        status: err.status || 500,
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body
    };

    if (err.status) {
        res.status(err.status).json(errorDetails);
    } else {
        res.status(500).json(errorDetails);
    }
};

export default errorHandler;