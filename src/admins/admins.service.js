const Admin = require("./admin.entity");
const Doctor = require("../doctors/doctor.entity");
const Archive_Doctor = require("../archives/doctor.archive");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { NotFound, Forbidden } = require("http-errors");

class AdminService {
	create(data) {
		const admin = new Admin(data);
		admin.password = "medicalcenteradmin";
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

	async update(id, data) {
		const admin = await this.findOne(id);

		if (!!data.password) {
			if (!bcrypt.compareSync(data.oldPassword, admin.password))
				throw new Forbidden("Wrong password!");

			admin.password = data.password;
		}

		admin.email = data.email;
		return admin.save();
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

	async getDoctors(skip) {
		const doctors = await Doctor.find({}).limit(10).skip(skip);
		const count = await Doctor.countDocuments();
		return { doctors, count };
	}

	async searchDoctors(data, skip) {
		const name = data.name ? data.name.toLowerCase().split(" ") : [];
		const profession = data.profession;

		let doctors = await Doctor.find({
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
