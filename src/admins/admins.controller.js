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

router.patch(
	"/",
	asyncHandler(async (req, res) => {
		await admins.update(req.user.id, req.body);
		res.send();
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
		const skip = req.query.skip;
		const doctors = await admins.getDoctors(+skip);
		res.json(doctors);
	})
);

router.post(
	"/getDoctors",
	asyncHandler(async (req, res) => {
		const skip = req.query.skip;
		const result = await admins.searchDoctors(req.body, +skip);
		res.json(result);
	})
);

router.get(
	"/getDoctor/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		const skip = req.query.skip;
		const result = await admins.getDoctor(id, +skip);
		res.json(result);
	})
);

router.post(
	"/searchDoctorDiagnoses/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		const skip = req.query.skip;
		const result = await admins.searchDoctorDiagnoses(id, req.body, +skip);
		res.json(result);
	})
);

router.post(
	"/warning/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		await admins.writeWarning(id, req.body);
		res.send();
	})
);

router.delete(
	"/doctor/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		await admins.deleteDoctor(id, req.body);
		res.send();
	})
);

module.exports = router;
