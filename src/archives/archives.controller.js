const express = require("express");
const router = express.Router();
const archives = require("./archives.service");
const asyncHandler = require("express-async-handler");

router.use(function timeLog(req, res, next) {
	console.log("Diagnosis request received. Time: ", new Date());
	next();
});

router.get(
	"/getDoctors",
	asyncHandler(async (req, res) => {
		const skip = req.query.skip;
		const result = await archives.getDoctors(+skip);
		res.json(result);
	})
);

router.post(
	"/getDoctors",
	asyncHandler(async (req, res) => {
		const skip = req.query.skip;
		const result = await archives.searchDoctors(req.body, +skip);
		res.json(result);
	})
);

router.get(
	"/getDoctor/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		const skip = req.query.skip;
		const result = await archives.getDoctor(id, +skip);
		res.json(result);
	})
);

router.post(
	"/searchDoctorDiagnoses/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		const skip = req.query.skip;
		const result = await archives.searchDoctorDiagnoses(id, req.body, +skip);
		res.json(result);
	})
);

router.get(
	"/getPatients",
	asyncHandler(async (req, res) => {
		const skip = req.query.skip;
		const result = await archives.getPatients(+skip);
		res.json(result);
	})
);

router.post(
	"/getPatients/name",
	asyncHandler(async (req, res) => {
		const skip = req.query.skip;
		const result = await archives.searchPatientsByName(req.body, +skip);
		res.json(result);
	})
);

router.post(
	"/getPatients/id",
	asyncHandler(async (req, res) => {
		const result = await archives.searchPatientsById(req.body);
		res.json(result);
	})
);

router.get(
	"/getPatient/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		const patient = await archives.getPatient(id);
		res.json(patient);
	})
);

router.get(
	"/getDiagnoses/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		const skip = req.query.skip;
		const result = await archives.getDiagnoses(id, +skip);
		res.json(result);
	})
);

router.post(
	"/getDiagnoses/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		const skip = req.query.skip;
		const result = await archives.searchDiagnoses(id, req.body, +skip);
		res.json(result);
	})
);

router.get(
	"/getDiagnoses",
	asyncHandler(async (req, res) => {
		const skip = req.query.skip;
		const result = await archives.getAllDiagnoses(+skip);
		res.json(result);
	})
);

module.exports = router;
