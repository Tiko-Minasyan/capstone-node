const Diagnosis = require("./diagnosis.entity");

class DiagnosisService {
	create(data) {
		const diagnosis = new Diagnosis(data);
		return diagnosis.save();
	}
}

module.exports = new DiagnosisService();
