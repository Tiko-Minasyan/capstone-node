const express = require("express");
const router = express.Router();
const diagnosis = require("./diagnoses.service");
const asyncHandler = require("express-async-handler");

router.use(function timeLog(req, res, next) {
	console.log("Diagnosis request received. Time: ", new Date());
	next();
});

router.post(
	"/",
	asyncHandler((req, res) => {
		diagnosis.create(req.body);
		res.status(201).send();
	})
);

module.exports = router;
