const Patient = require("./patient.entity");
const Diagnosis = require("../diagnoses/diagnosis.entity");
const { NotFound } = require("http-errors");
const Archive_Patient = require("../archives/patient.archive");
const Archive_Diagnosis = require("../archives/diagnosis.archive");

class PatientsService {
	create(data, id) {
		const patient = new Patient(data);
		patient.createdBy = id;
		patient.save();
		return patient._id;
	}

	async getAll(skip) {
		const patients = await Patient.find({}).limit(10).skip(skip);
		const count = await Patient.countDocuments();
		return { patients, count };
	}

	async searchByName(data, skip) {
		const name = data.name.toLowerCase().split(" ");
		if (name.length > 3) return [];

		let patients = await Patient.find({});
		const search = [name[0]];
		search.push(name[1] !== undefined ? name[1] : "");
		search.push(name[2] !== undefined ? name[2] : "");

		patients = patients.filter((patient) => {
			const fullName = [
				patient.name.toLowerCase(),
				patient.surname.toLowerCase(),
				patient.fatherName.toLowerCase(),
			];

			return (
				(fullName[0].includes(search[0]) &&
					fullName[1].includes(search[1]) &&
					fullName[2].includes(search[2])) ||
				(fullName[0].includes(search[1]) &&
					fullName[1].includes(search[0]) &&
					fullName[2].includes(search[2]))
			);
		});

		return {
			patients: patients.slice(skip, skip + 10),
			count: patients.length,
		};
	}

	async searchById(data) {
		const id = data.id;

		const patients = await Patient.find({
			$or: [{ passportID: id }, { SSID: id }],
		});

		return { patients, count: patients.length };
	}

	async findOne(id) {
		const patient = await Patient.findById(id);
		if (!patient) throw new NotFound("Patient not found!");
		return patient;
	}

	async update(id, data) {
		let patient = await this.findOne(id);
		const address = patient.address;
		patient = Object.assign(patient, data);
		if (address !== patient.address) {
			patient.previousAddresses = [...patient.previousAddresses, address];
		}
		return patient.save();
	}

	async delete(id, doctorId, data) {
		const patientDiagnoses = await Diagnosis.find({ patient: id });

		patientDiagnoses.forEach((item) => {
			const diagnosisObject = item.toObject();
			const archive = new Archive_Diagnosis(diagnosisObject);

			archive.deletedAt = Date.now();
			archive.save();

			item.delete();
		});

		const patient = await this.findOne(id);

		const patientObject = patient.toObject();
		delete patientObject._id;
		const archive = new Archive_Patient(patientObject);

		archive.deleteReason = data.deleteReason;
		archive.deletedAt = Date.now();
		archive.deletedBy = doctorId;
		archive._id = id;
		archive.save();

		return patient.delete();
	}
}

module.exports = new PatientsService();
