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
		const skip = req.query.skip;
		const result = await diagnosis.get(id, +skip);
		res.json({ ...result, doctorId: req.user.id });
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

router.post(
	"/search/:id",
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		const skip = req.query.skip;
		const result = await diagnosis.search(id, req.body, +skip);
		res.json(result);
	})
);

module.exports = router;
