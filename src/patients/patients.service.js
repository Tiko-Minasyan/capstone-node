const Patient = require("./patient.entity");
const Diagnosis = require("../diagnoses/diagnosis.entity");
const diagnoses = require("../diagnoses/diagnoses.service");
const { NotFound } = require("http-errors");
const Archive_Patient = require("../archives/patient.archive");
const Archive_Diagnosis = require("../archives/diagnosis.archive");

class PatientsService {
	create(data) {
		const patient = new Patient(data);
		patient.save();
		return patient._id;
	}

	async getAll() {
		const patients = Patient.find({});
		return patients;
	}

	async findOne(id) {
		const patient = await Patient.findById(id);
		if (!patient) throw new NotFound("Patient not found!");
		return patient;
	}

	async update(id, data) {
		let patient = await this.findOne(id);
		patient = Object.assign(patient, data);
		return patient.save();
	}

	async delete(id, doctorId) {
		const patientDiagnoses = await diagnoses.get(id);

		patientDiagnoses.forEach((item) => {
			const diagnosisObject = item.toObject();
			delete diagnosisObject._id;
			const archive = new Archive_Diagnosis(diagnosisObject);

			archive.deletedAt = Date.now();
			archive.save();

			item.delete();
		});

		const patient = await this.findOne(id);

		const patientObject = patient.toObject();
		delete patientObject._id;
		const archive = new Archive_Patient(patientObject);

		archive.deletedAt = Date.now();
		archive.deletedBy = doctorId;
		archive.save();

		return patient.delete();
	}
}

module.exports = new PatientsService();
