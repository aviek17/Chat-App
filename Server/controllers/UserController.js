const userService = require("../service/UserService")


const signup = async (req, res, next) => {
    try {
        const responseData = await userService.handleUserCreation(req.validatedBody);
        res.status(200).json(responseData);
    } catch (err) {
        next(err);
    }
}

module.exports = { signup };