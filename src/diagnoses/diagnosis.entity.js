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
		// Complaint														-- Headache, high body temperature
		// Anamnesis (medical history, previous illnesses)					-- Ill for 5 days. Has diabetes for 20 years
		// Objective status (what problems the doctor saw)					-- Skin irritations, redness, body temperature 38C, throat is red, lungs are clear, heartbeat is quick ...
		// Diagnosis (? if unsure, without if sure)							-- Acute resperature infection, ? diabetes
		// Research plan (what the doctor plans to do with the patient)		-- Blood test, throat liquid analysis, urine test, endocrynologist consultation
		// Cure	(cannot edit existing cures, can only add)					-- Antibiotics 5 days, Vitamin C 3 days. Recommendation - stay at home, dietic food, another visit in 5 days

		// Final Diagnosis													-- Acording to MRT and XRAY, the patient has cancer
	},
	{}
);

module.exports = mongoose.model("Diagnosis", schema);
