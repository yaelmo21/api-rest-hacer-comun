const logErrors = (err, req, res, next) => {
    console.log("Ha ocurrido un error");
    console.error(err);
    next(err);
};

const errorHandler = (err, req, res, next) => {
    console.log("Error Handler");
    const { message } = err;
    res.status(500).json({ ok: false, message });
};

module.exports = {
    logErrors,
    errorHandler,
};