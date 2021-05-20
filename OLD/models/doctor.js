const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const doctorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	surname: {
		type: String,
		required: true,
		trim: true
	},
	profession: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
		trim: true
	},
	admin: {
		type: Boolean,
		default: false
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}]
}, {
	timestamps: true
})

doctorSchema.methods.toJSON = function () {
	const doctor = this;
	const doctorObject = doctor.toObject();

	delete doctorObject.password
	delete doctorObject.tokens

	return doctorObject
}

doctorSchema.methods.generateAuthToken = async function() {
	const doctor = this;
	const token = jwt.sign({ _id: doctor._id.toString() }, process.env.JWT_SECRET)

	doctor.tokens = doctor.tokens.concat({ token });
    await doctor.save();

    return token;
}

doctorSchema.statics.findByCredentials = async (username, password) => {
	let fullName = username.split(' ');
	const name = fullName[0];
	const surname = fullName[1];
	const doctor = await Doctor.findOne({ name, surname });

	if(!doctor) {
		throw new Error();
	}

	const isMatch = await bcrypt.compare(password, doctor.password);

	if(!isMatch) {
		throw new Error();
	}

	return doctor;
}

doctorSchema.pre('save', async function (next) {
	const doctor = this;

	if(doctor.isModified('password')) {
		doctor.password = await bcrypt.hash(doctor.password, 8)
	}

	next();
})

const Doctor = mongoose.model('Doctor', doctorSchema)

module.exports = Doctor