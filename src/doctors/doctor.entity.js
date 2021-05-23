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
	},
	{ collection: "doctors" }
);

schema.methods.toJSON = function () {
	const doctor = this;
	const doctorObject = doctor.toObject();

	delete doctorObject.password;
	delete doctorObject.tokens;

	return doctorObject;
};

module.exports = mongoose.model("Doctor", schema);
