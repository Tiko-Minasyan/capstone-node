const Patient = require("./patient.entity");

class PatientsService {
	create(data) {
		console.log(data);
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
		return patient;
	}
}

module.exports = new PatientsService();
