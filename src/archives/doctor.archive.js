const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		surname: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		profession: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			default: "",
		},
		address: {
			type: String,
			default: "",
		},
		warnings: {
			type: Array,
			required: true,
		},
		deleteReason: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			required: true,
		},
		deletedAt: {
			type: Date,
			required: true,
		},
	},
	{ collection: "archive-doctors" }
);

module.exports = mongoose.model("Archive_Doctor", schema);
