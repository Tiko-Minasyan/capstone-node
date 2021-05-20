const { Forbidden } = require("http-errors");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
	try {
		const token = req.header("Authorization").split(" ")[1];
		const user = jwt.verify(token, process.env.JWT_SECRET);

		req.user = user;
	} catch (e) {
		return next(new Forbidden("Not authorized!"));
	}

	next();
};

authMiddleware.unless = require("express-unless");

module.exports = authMiddleware;
