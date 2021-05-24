const Diagnosis = require("./diagnosis.entity");

class DiagnosisService {
	async get(id) {
		const diagnoses = await Diagnosis.find({ patientID: id }).populate(
			"doctor"
		);
		return diagnoses;
	}

	create(id, userId, data) {
		const diagnosis = new Diagnosis({
			doctor: userId,
			patientID: id,
			details: data.text,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
		return diagnosis.save();
	}

	async update(id, data) {
		let diagnosis = await Diagnosis.findById(id);
		diagnosis = Object.assign(diagnosis, {
			details: data.text,
			updatedAt: Date.now(),
		});
		return diagnosis.save();
	}

	async delete(id) {
		const diagnosis = await Diagnosis.findById(id);
		return diagnosis.delete();
	}
}

module.exports = new DiagnosisService();
