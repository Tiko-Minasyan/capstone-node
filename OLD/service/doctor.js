const Doctor = require("../models/doctor");

class DoctorService {
	create(data) {
		const doctor = new Doctor(data);
		return doctor.save();
	}

	async login(username, password) {
		const doctor = await Doctor.findByCredentials(username, password);
		const token = await doctor.generateAuthToken();
		return token;
	}

	logout(doctor, doctorToken) {
		doctor.tokens = doctor.tokens.filter(
			(token) => token.token !== doctorToken
		);
		return doctor.save();
	}
}

module.exports = new DoctorService();
