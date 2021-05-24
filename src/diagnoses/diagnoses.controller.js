const express = require("express");
const router = express.Router();
const diagnosis = require("./diagnoses.service");
const asyncHandler = require("express-async-handler");

router.use(function timeLog(req, res, next) {
	console.log("Diagnosis request received. Time: ", new Date());
	next();
});

router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		const diagnoses = await diagnosis.get(id);
		res.json({ diagnoses, doctorId: req.user.id });
	})
);

router.post(
	"/:id",
	asyncHandler((req, res) => {
		const id = req.params.id;
		diagnosis.create(id, req.user.id, req.body);
		res.status(201).send();
	})
);

router.patch(
	"/:id",
	asyncHandler((req, res) => {
		const id = req.params.id;
		diagnosis.update(id, req.body);
		res.send();
	})
);

router.delete(
	"/:id",
	asyncHandler((req, res) => {
		const id = req.params.id;
		diagnosis.delete(id);
		res.send();
	})
);

module.exports = router;
