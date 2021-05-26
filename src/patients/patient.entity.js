const mongoose = require("mongoose");
const Doctor = require("../doctors/doctor.entity");
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
			required: true,
		},
		previousAddresses: {
			type: Array,
			default: [],
		},
		passportID: {
			type: String,
			required: true,
		},
		SSID: {
			type: String,
			required: true,
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: Doctor,
			required: true,
		},
	},
	{ collection: "patients" }
);

module.exports = mongoose.model("Patient", schema);
