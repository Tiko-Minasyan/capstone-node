const express = require("express");
const router = express.Router();
const users = require("./users.service");
const asyncHandler = require("express-async-handler");

router.use(function timeLog(req, res, next) {
	console.log("Users request received. Time: ", new Date());
	next();
});

router.post(
	"/register",
	asyncHandler(async (req, res) => {
		const doctor = await users.create(req.body);
		res.status(201).send(doctor);
	})
);

router.post(
	"/login",
	asyncHandler(async (req, res) => {
		const token = await users.login(req.body);
		res.send(token);
	})
);

router.get(
	"/profile",
	asyncHandler(async (req, res) => {
		const user = await users.findOne(req.user.id);
		req.json(user);
	})
);

router.patch(
	"/edit",
	asyncHandler(async (req, res) => {
		if (req.body.password.length > 0) {
			const isMatch = await bcrypt.compare(
				req.body.oldPassword,
				req.user.password
			);
			if (!isMatch) {
				throw new Error("Passwords don't match!");
			}
		}

		const updates = req.body;
		delete updates.oldPassword;
		delete updates.token;
		if (updates.password === "") delete updates.password;

		let emailChanged = false;
		if (updates.email !== req.user.email) {
			req.user.verified = false;
			emailChanged = true;
		}

		for (let item in updates) {
			req.user[item] = updates[item];
		}
		await req.user.save();

		emailChanged && req.user.sendVerificationEmail(1);

		res.send();
	})
);

router.get(
	"/delete",
	asyncHandler(async (req, res) => {
		await req.user.remove();
		res.send();
	})
);

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

module.exports = router;
