const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Doctor = require("../doctors/doctor.entity");

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
		},
		passportID: {
			type: String,
			required: true,
		},
		SSN: {
			type: String,
			required: true,
		},
		deleteReason: {
			type: String,
			required: true,
		},
		deletedAt: {
			type: Date,
			required: true,
		},
		deletedBy: {
			type: mongoose.Types.ObjectId,
			ref: Doctor,
			required: true,
		},
	},
	{ collection: "archive-patients" }
);

module.exports = mongoose.model("Archive_Patient", schema);
