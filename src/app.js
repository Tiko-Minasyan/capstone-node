require("dotenv").config({
	path: "./config/dev.env",
});
require("./db/mongoose");
const cors = require("cors");
const express = require("express");
const app = express();

const doctors = require("./doctors/doctors.controller");
const admins = require("./admins/admins.controller");
const patients = require("./patients/patients.controller");
const diagnoses = require("./diagnoses/diagnoses.controller");
const archives = require("./archives/archives.controller");

const handleError = require("./middlewares/error-handler");
const authMiddleware = require("./middlewares/auth");
const adminMiddleware = require("./middlewares/checkAdmin");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use(
	authMiddleware.unless({
		path: [
			"/doctors/login",
			"/doctors/getRecoveryCode",
			"/doctors/sendRecoveryCode",
			"/doctors/recoverPassword",
			"/admins/login",
			"/admins/register",
		],
	})
);

app.use(
	"/admins",
	adminMiddleware.unless({
		path: ["/admins/login", "/admins/register"],
	})
);

app.use("/doctors", doctors);
app.use("/admins", admins);
app.use("/patients", patients);
app.use("/diagnoses", diagnoses);
app.use("/archives", archives);

app.use(handleError);

module.exports = app;
