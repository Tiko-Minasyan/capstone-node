const Patient = require("./patient.entity");
const Diagnosis = require("../diagnoses/diagnosis.entity");
const diagnoses = require("../diagnoses/diagnoses.service");
const { NotFound } = require("http-errors");

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

	async delete(id) {
		const patientDiagnoses = await diagnoses.get(id);
		patientDiagnoses.forEach((item) => item.delete());

		const patient = await this.findOne(id);
		return patient.delete();
	}
}

module.exports = new PatientsService();
