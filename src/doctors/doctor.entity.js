const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
		phone: {
			type: String,
			default: "",
		},
		address: {
			type: String,
			default: "",
		},
		photo: {
			type: String,
			default: "default.jpg",
		},
		password: {
			type: String,
			required: true,
			minLength: 8,
			trim: true,
		},
		firstLogin: {
			type: Boolean,
			default: true,
		},
		warnings: [
			{
				details: {
					type: String,
					required: true,
				},
				date: {
					type: Date,
					required: true,
				},
				severity: {
					type: String,
					enum: ["low", "medium", "high", "very high"],
				},
			},
		],
		createdAt: {
			type: Date,
			required: true,
		},
	},
	{ collection: "doctors" }
);

schema.methods.toJSON = function () {
	const doctor = this;
	const doctorObject = doctor.toObject();

	delete doctorObject.password;

	return doctorObject;
};

schema.pre("save", function (next) {
	if (this.isModified("password")) {
		const salt = bcrypt.genSaltSync(10);
		this.password = bcrypt.hashSync(this.password, salt);
	}

	next();
});

module.exports = mongoose.model("Doctor", schema);
