const User = require("./user.entity");
const jwt = require("jsonwebtoken");
const { NotFound, Forbidden } = require("http-errors");

class UserService {
	create(data) {
		const doctor = new User(data);
		return doctor.save();
	}

	async login(data) {
		const user = await User.findOne({ email: data.email });
		if (!user) throw new NotFound("User not found!");
		if (user.password !== data.password) throw new Forbidden("Wrong password!");

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRES_IN,
			}
		);

		return token;
	}

	async findOne(id) {
		const user = await User.findById(id);
		if (!user) throw new NotFoud("User not found!");
		return user;
	}
}

module.exports = new UserService();
