const Doctor = require("./doctor.entity");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { NotFound, Forbidden, Conflict } = require("http-errors");

class DoctorService {
	async login(data) {
		const doctor = await Doctor.findOne({ email: data.email });
		if (!doctor) throw new NotFound("Doctor not found!");

		if (!bcrypt.compareSync(data.password, doctor.password))
			throw new Forbidden("Wrong password!");

		const token = jwt.sign(
			{ id: doctor.id, email: doctor.email },
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRES_IN,
			}
		);

		return token;
	}

	async findOne(id) {
		const doctor = await Doctor.findById(id);
		if (!doctor) throw new NotFound("Doctor not found!");
		return doctor;
	}

	async checkDoctor(user) {
		if (user.isAdmin === true) throw new Conflict("You are an admin!");
	}

	async update(id, data) {
		let doctor = await this.findOne(id);
		doctor = Object.assign(doctor, data);
		return doctor.save();
	}

	async updatePassword(id, data) {
		let doctor = await this.findOne(id);

		if (!bcrypt.compareSync(data.oldPassword, doctor.password))
			throw new Forbidden("Wrong password!");

		doctor = Object.assign(doctor, {
			password: data.password,
			firstLogin: false,
		});
		return doctor.save();
	}
}

module.exports = new DoctorService();
