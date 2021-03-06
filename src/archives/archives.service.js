const Archive_Doctor = require("./doctor.archive");
const Archive_Patient = require("./patient.archive");
const Archive_Diagnosis = require("./diagnosis.archive");
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

	async getDoctor(id, skip) {
		const doctor = await Archive_Doctor.findById(id);
		if (!doctor) throw new NotFound("Doctor not found!");

		const result = await diagnosis.getByDoctorId(id, skip);

		return { doctor, diagnoses: result.diagnoses, count: result.count };
	}

	async searchDoctorDiagnoses(id, data, skip) {
		const result = await diagnosis.searchByPatient(id, data, skip);
		return { diagnoses: result.diagnoses, count: result.count };
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
			$or: [{ passportID: id }, { SSN: id }],
		});

		return { patients, count: patients.length };
	}

	async getPatient(id) {
		const patient = await Archive_Patient.findById(id);
		if (!patient) throw new NotFound("Patient not found!");
		return patient;
	}

	async getDiagnoses(id, skip) {
		const diagnoses = await Archive_Diagnosis.find({ patient: id })
			.populate("doctor")
			.populate("archivedDoctor")
			.sort({ updatedAt: -1 })
			.limit(10)
			.skip(skip);

		const count = await Archive_Diagnosis.find({
			patient: id,
		}).countDocuments();
		return { diagnoses, count };
	}

	async searchDiagnoses(id, data, skip) {
		let diagnoses = await Archive_Diagnosis.find({ patient: id })
			.populate("doctor")
			.populate("archivedDoctor")
			.sort({ updatedAt: -1 });

		const searchProfession = data.profession.toLowerCase();
		let isFinished = null;
		if (data.finished === "Finished") isFinished = true;
		if (data.finished === "Unfinished") isFinished = false;

		diagnoses = diagnoses.filter((diagnosis) => {
			let profession;

			if (diagnosis.doctor) {
				profession = diagnosis.doctor.profession.toLowerCase();
			} else {
				profession = diagnosis.archivedDoctor.profession.toLowerCase();
			}

			if (isFinished !== null) {
				return (
					profession.includes(searchProfession) &&
					diagnosis.isFinished === isFinished
				);
			} else {
				return profession.includes(searchProfession);
			}
		});

		return {
			diagnoses: diagnoses.slice(skip, skip + 10),
			count: diagnoses.length,
		};
	}

	async getAllDiagnoses(skip) {
		const diagnoses = await Archive_Diagnosis.find({})
			.populate("doctor")
			.populate("archivedDoctor")
			.populate("patient")
			.populate("archivedPatient")
			.sort({ updatedAt: -1 })
			.limit(10)
			.skip(skip);

		const count = await Archive_Diagnosis.countDocuments();
		return { diagnoses, count };
	}

	async searchAllDiagnoses(data, skip) {
		let diagnoses = await Archive_Diagnosis.find({})
			.populate("doctor")
			.populate("archivedDoctor")
			.populate("patient")
			.populate("archivedPatient")
			.sort({ updatedAt: -1 });

		const searchProfession = data.profession.toLowerCase();
		let isFinished = null;
		if (data.finished === "Finished") isFinished = true;
		if (data.finished === "Unfinished") isFinished = false;

		diagnoses = diagnoses.filter((diagnosis) => {
			let profession;

			if (diagnosis.doctor) {
				profession = diagnosis.doctor.profession.toLowerCase();
			} else {
				profession = diagnosis.archivedDoctor.profession.toLowerCase();
			}

			if (isFinished !== null) {
				return (
					profession.includes(searchProfession) &&
					diagnosis.isFinished === isFinished
				);
			} else {
				return profession.includes(searchProfession);
			}
		});

		return {
			diagnoses: diagnoses.slice(skip, skip + 10),
			count: diagnoses.length,
		};
	}
}

module.exports = new ArchiveService();
