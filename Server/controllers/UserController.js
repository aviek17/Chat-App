const userService = require("../service/UserService")


const signup = async (req, res, next) => {
    try {
        console.log(req.validatedBody)
        const responseData = await userService.handleUserCreation(req.validatedBody);
        res.status(200).json(responseData);
    } catch (err) {
        console.log(err)
        next(err.error);
    }
}

module.exports = { signup };