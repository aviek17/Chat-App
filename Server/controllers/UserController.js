const userService = require("../service/UserService")


const signup = async (req, res) => {
    try {
        const responseData = await userService.handleUserCreation(req.user);
        res.status(200).json(responseData);
    } catch (err) {
        console.error(err);

    }
}

module.exports = { signup };