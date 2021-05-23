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
		password: {
			type: String,
			required: true,
			minLength: 8,
			trim: true,
		},
	},
	{ collection: "admins" }
);

module.exports = mongoose.model("Admin", schema);
