const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		surname: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		profession: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 8,
			trim: true,
		},
		admin: {
			type: Boolean,
			default: false,
		},
	},
	{ collection: "users" }
);

schema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

module.exports = mongoose.model("User", schema);
