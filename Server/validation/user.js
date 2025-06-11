const { z } = require('zod');

const userRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});


module.exports = {
    userRequestSchema
};
