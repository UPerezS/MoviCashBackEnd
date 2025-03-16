const handleHttpError = (res, message = "Ocurrió un error", code = 500, error = null) => {
    const response = { 
        error: message 
    };

    // Si el error tiene más información, la agregamos
    if (error) {
        response.details = error.message || error;
        
    }

    res.status(code).json(response);
};

module.exports = handleHttpError;