const express = require("express");
const router = express.Router();
const doctors = require("./doctors.service");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const upload = multer();

router.use(function timeLog(req, res, next) {
	console.log("Doctors request received. Time: ", new Date());
	next();
});

router.post(
	"/register",
	asyncHandler(async (req, res) => {
		const user = await doctors.create(req.body);
		res.status(201).json(user);
	})
);

router.post(
	"/login",
	asyncHandler(async (req, res) => {
		const token = await doctors.login(req.body);
		res.send(token);
	})
);

router.get(
	"/profile",
	asyncHandler(async (req, res) => {
		await doctors.checkDoctor(req.user);
		const user = await doctors.findOne(req.user.id);
		res.json(user);
	})
);

router.patch(
	"/",
	asyncHandler(async (req, res) => {
		await doctors.update(req.user.id, req.body);
		res.send();
	})
);

router.patch(
	"/password",
	asyncHandler(async (req, res) => {
		await doctors.updatePassword(req.user.id, req.body);
		res.send();
	})
);

router.post(
	"/picture",
	upload.single("file"),
	asyncHandler(async (req, res) => {
		await doctors.editPicture(req.user.id, req.file);
		res.send();
	})
);

router.get(
	"/deletePicture",
	asyncHandler(async (req, res) => {
		await doctors.deletePicture(req.user.id);
		res.send();
	})
);

/*
router.get("/verifyEmail", async (req, res) => {
	const email = req.query.email;

	try {
		const user = await User.findOne({ email });
		user.verified = true;
		await user.save();

		const message = `<h1>Your email address has been verified!</h1>
		<p>Click <a href='http://localhost:8080/profile'>here</a> to get back to your profile page.</p>`;
		res.send(message);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.get("/sendVerify", async (req, res) => {
	try {
		req.user.sendVerificationEmail(2);
		res.send();
	} catch (e) {
		res.status(400).send(e);
	}
});
*/

module.exports = router;
