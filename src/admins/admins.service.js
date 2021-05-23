const Admin = require("./admin.entity");
const Doctor = require("../doctors/doctor.entity");
const jwt = require("jsonwebtoken");
const { NotFound, Forbidden } = require("http-errors");

class AdminService {
	create(data) {
		const admin = new Admin(data);
		return admin.save();
	}

	async login(data) {
		const admin = await Admin.findOne({ email: data.email });
		if (!admin) throw new NotFound("Admin not found!");
		if (admin.password !== data.password)
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
		return doctor.save();
	}

	async getDoctors() {
		const doctors = await Doctor.find({});
		return doctors;
	}

	async deleteDoctor(data) {
		const doctor = await Doctor.findById(data._id);
		return doctor.delete();
	}
}

module.exports = new AdminService();
