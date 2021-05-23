const express = require("express");
const router = express.Router();
const admins = require("./admins.service");
const asyncHandler = require("express-async-handler");

router.use(function timeLog(req, res, next) {
	console.log("Admins request received. Time: ", new Date());
	next();
});

router.post(
	"/register",
	asyncHandler(async (req, res) => {
		const admin = await admins.create(req.body);
		res.status(201).json(admin);
	})
);

router.post(
	"/login",
	asyncHandler(async (req, res) => {
		const token = await admins.login(req.body);
		res.send(token);
	})
);

router.get(
	"/profile",
	asyncHandler(async (req, res) => {
		const admin = await admins.findOne(req.user.id);
		res.json(admin);
	})
);

router.post(
	"/registerDoctor",
	asyncHandler(async (req, res) => {
		await admins.createDoctor(req.body);
		res.status(201).send();
	})
);

router.get(
	"/getDoctors",
	asyncHandler(async (req, res) => {
		doctors = await admins.getDoctors();
		res.json(doctors);
	})
);

router.delete(
	"/doctor",
	asyncHandler(async (req, res) => {
		doctor = await admins.deleteDoctor(req.body.doctor);
		res.json(doctor);
	})
);

module.exports = router;
