const express = require("express");
const router = express.Router();
const patients = require("./patients.service");
const asyncHandler = require("express-async-handler");

router.use(function timeLog(req, res, next) {
	console.log("Patients request received. Time: ", new Date());
	next();
});

router.post(
	"/",
	asyncHandler(async (req, res) => {
		const id = await patients.create(req.body, req.user.id);
		res.status(201).send(id);
	})
);

router.get(
	"/",
	asyncHandler(async (req, res) => {
		const skip = req.query.skip;
		const result = await patients.getAll(+skip);
		res.json(result);
	})
);

router.post(
	"/name",
	asyncHandler(async (req, res) => {
		const skip = req.query.skip;
		const result = await patients.searchByName(req.body, +skip);
		res.json(result);
	})
);

router.post(
	"/id",
	asyncHandler(async (req, res) => {
		const result = await patients.searchById(req.body);
		res.json(result);
	})
);

router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		const patient = await patients.findOne(id);
		res.json(patient);
	})
);

router.patch(
	"/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		await patients.update(id, req.body);
		res.send();
	})
);

router.delete(
	"/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		await patients.delete(id, req.user.id);
		res.send();
	})
);

module.exports = router;
