const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Doctor = require("../doctors/doctor.entity");
const Patient = require("../patients/patient.entity");

const schema = new Schema(
	{
		doctor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Doctor,
		},
		patientID: {
			type: mongoose.Types.ObjectId,
			ref: Patient,
		},
		details: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		updatedAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{}
);

module.exports = mongoose.model("Diagnosis", schema);
