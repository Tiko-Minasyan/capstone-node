const Diagnosis = require("./diagnosis.entity");
const Archive_Diagnosis = require("../archives/diagnosis.archive");

class DiagnosisService {
	async get(id, skip) {
		const diagnoses = await Diagnosis.find({ patient: id })
			.populate("doctor")
			.populate("archivedDoctor")
			.sort({ updatedAt: -1 })
			.limit(10)
			.skip(skip);

		const count = await Diagnosis.find({ patient: id }).countDocuments();
		return { diagnoses, count };
	}

	async search(id, data, skip) {
		let diagnoses = await Diagnosis.find({ patient: id })
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
