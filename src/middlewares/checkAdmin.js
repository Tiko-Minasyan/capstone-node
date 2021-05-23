const { Forbidden } = require("http-errors");

const adminMiddleware = async (req, res, next) => {
	if (!req.user.isAdmin) return next(new Forbidden("You are not an admin!"));

	next();
};

adminMiddleware.unless = require("express-unless");

module.exports = adminMiddleware;
