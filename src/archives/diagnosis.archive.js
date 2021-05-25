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
		complains: {
			type: String,
			required: true,
			trim: true,
		},
		anamnesis: {
			type: String,
			required: true,
			trim: true,
		},
		objectiveStatus: {
			type: String,
			required: true,
			trim: true,
		},
		diagnosis: {
			type: String,
			required: true,
			trim: true,
		},
		researchPlan: {
			type: String,
			required: true,
			trim: true,
		},
		cures: {
			type: Array,
			default: [],
		},
		finalDiagnosis: {
			type: String,
			trim: true,
		},
		isFinished: {
			type: Boolean,
			default: false,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		updatedAt: {
			type: Date,
			default: Date.now(),
		},
		deletedAt: {
			type: Date,
			required: true,
		},
	},
	{ collection: "archive-diagnoses" }
);

module.exports = mongoose.model("Archive_Diagnosis", schema);
