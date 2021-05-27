const Diagnosis = require("./diagnosis.entity");
const Archive_Diagnosis = require("../archives/diagnosis.archive");

class DiagnosisService {
	async get(id) {
		const diagnoses = await Diagnosis.find({ patient: id })
			.populate({
				path: "doctor",
			})
			.populate("archivedDoctor")
			.sort({ updatedAt: -1 });

		return diagnoses;
	}

	async getByDoctorId(id) {
		const diagnoses = await Diagnosis.find({ doctor: id })
			.populate("patient")
			.sort({ updatedAt: -1 });

		return diagnoses;
	}

	create(id, userId, data) {
		let isFinished = false;
		if (data.finalDiagnosis !== "") isFinished = true;

		const diagnosis = new Diagnosis({
			...data,
			doctor: userId,
			archivedDoctor: userId,
			patient: id,
			archivedPatient: id,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			isFinished,
		});
		return diagnosis.save();
	}

	async update(id, data) {
		let diagnosis = await Diagnosis.findById(id);

		let isFinished = false;
		if (data.finalDiagnosis !== "") isFinished = true;

		diagnosis = Object.assign(diagnosis, {
			...data,
			updatedAt: Date.now(),
			isFinished,
		});
		return diagnosis.save();
	}

	async delete(id) {
		const diagnosis = await Diagnosis.findById(id);

		const diagnosisObject = diagnosis.toObject();
		delete diagnosisObject._id;
		const archive = new Archive_Diagnosis(diagnosisObject);

		archive.deletedAt = Date.now();
		archive.save();

		return diagnosis.delete();
	}
}

module.exports = new DiagnosisService();
