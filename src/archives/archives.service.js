const Archive_Doctor = require("./doctor.archive");
const Archive_Patient = require("./patient.archive");
const diagnosis = require("../diagnoses/diagnoses.service");
const { NotFound } = require("http-errors");

class ArchiveService {
	async getDoctors(skip) {
		const doctors = await Archive_Doctor.find({}).limit(10).skip(skip);
		const count = await Archive_Doctor.countDocuments();
		return { doctors, count };
	}

	async searchDoctors(data, skip) {
		const name = data.name ? data.name.toLowerCase().split(" ") : [];
		const profession = data.profession;

		let doctors = await Archive_Doctor.find({
			profession: { $regex: new RegExp(".*" + profession + ".*", "i") },
		});

		if (name.length === 0)
			return { doctors: doctors.slice(skip, skip + 10), count: doctors.length };
		if (name.length > 2) return [];

		const nameSurname = [name[0]];
		nameSurname.push(name[1] !== undefined ? name[1] : "");

		doctors = doctors.filter((doctor) => {
			const fullName = [
				doctor.name.toLowerCase(),
				doctor.surname.toLowerCase(),
			];

			return (
				(fullName[0].includes(nameSurname[0]) &&
					fullName[1].includes(nameSurname[1])) ||
				(fullName[0].includes(nameSurname[1]) &&
					fullName[1].includes(nameSurname[0]))
			);
		});

		return { doctors: doctors.slice(skip, skip + 10), count: doctors.length };
	}

	async getDoctor(id) {
		const doctor = await Archive_Doctor.findById(id);
		if (!doctor) throw new NotFound("Doctor not found!");

		const diagnoses = await diagnosis.getByDoctorId(id);

		return { doctor, diagnoses };
	}

	async getPatients(skip) {
		const patients = await Archive_Patient.find({}).limit(10).skip(skip);
		const count = await Archive_Patient.countDocuments();
		return { patients, count };
	}

	async searchPatientsByName(data, skip) {
		const name = data.name.toLowerCase().split(" ");
		if (name.length > 3) return [];

		let patients = await Archive_Patient.find({});
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

	async searchPatientsById(data) {
		const id = data.id;

		const patients = await Archive_Patient.find({
			$or: [{ passportID: id }, { SSID: id }],
		});

		return { patients, count: patients.length };
	}

	async getPatient(id) {
		const patient = await Archive_Patient.findById(id);
		if (!patient) throw new NotFound("Patient not found!");
		return patient;
	}
}

module.exports = new ArchiveService();
