const ValidationError = require("../errors/ValidationError");

const validateRequest = (schema) => (req, res, next) => {
    try {
        req.validatedBody = schema.parse(req.body);
        next();
    } catch (error) {
        if (error.name === 'ZodError') {
            const formatted = error.errors.map(e => ({
                path: e.path.join('.'),
                message: e.message,
            }));
            return next(new ValidationError('Invalid Body', formatted));
        }
        next(error);
    }
};

module.exports = validateRequest;
