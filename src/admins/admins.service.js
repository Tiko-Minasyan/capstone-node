const Admin = require("./admin.entity");
const Doctor = require("../doctors/doctor.entity");
const Archive_Doctor = require("../archives/doctor.archive");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { NotFound, Forbidden } = require("http-errors");

class AdminService {
	create(data) {
		const admin = new Admin(data);
		return admin.save();
	}

	async login(data) {
		const admin = await Admin.findOne({ email: data.email });
		if (!admin) throw new NotFound("Admin not found!");

		if (!bcrypt.compareSync(data.password, admin.password))
			throw new Forbidden("Wrong password!");

		const token = jwt.sign(
			{ id: admin.id, email: admin.email, isAdmin: true },
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRES_IN,
			}
		);

		return token;
	}

	async findOne(id) {
		const admin = await Admin.findById(id);
		if (!admin) throw new NotFoud("Admin not found!");
		return admin;
	}

	createDoctor(data) {
		const doctor = new Doctor(data);
		doctor.password = "medicalcenterapp";
		return doctor.save();
	}

	async getDoctors() {
		const doctors = await Doctor.find({});
		return doctors;
	}

	async getDoctor(id) {
		const doctor = await Doctor.findById(id);
		if (!doctor) throw new NotFound("Doctor not found!");
		return doctor;
	}

	async deleteDoctor(id) {
		const doctor = await Doctor.findById(id);

		const doctorObject = doctor.toObject();
		delete doctorObject._id;
		const archive = new Archive_Doctor(doctorObject);

		archive.deletedAt = Date.now();
		archive.save();

		return doctor.delete();
	}
}

module.exports = new AdminService();
