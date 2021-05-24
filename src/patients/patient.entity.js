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
		fatherName: {
			type: String,
			default: "",
			trim: true,
		},
		birthday: {
			type: Date,
			required: true,
		},
		phone: {
			type: String,
			default: "",
		},
		address: {
			type: String,
			default: "",
		}, // SSID
	},
	{ collection: "patients" }
);

module.exports = mongoose.model("Patient", schema);
