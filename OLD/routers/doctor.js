const express = require("express");
const Doctor = require("../models/doctor");
const service = require("../service/doctor");
const auth = require("../../src/middlewares/auth");
const bcrypt = require("bcryptjs");
const router = new express.Router();

router.post("/register", async (req, res) => {
	try {
		const doctor = await service.create(req.body);
		res.status(201).send(doctor);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.post("/login", async (req, res) => {
	try {
		const token = await service.login(req.body.username, req.body.password);
		res.send(token);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.get("/profile", auth, async (req, res) => {
	try {
		res.send(req.doctor);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.patch("/edit", auth, async (req, res) => {
	try {
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
	} catch (e) {
		res.status(400).send(e);
	}
});

router.get("/logout", auth, async (req, res) => {
	try {
		await service.logout(req.doctor, req.token);
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.get("/delete", auth, async (req, res) => {
	try {
		await req.user.remove();
		res.send();
	} catch (e) {
		res.status(500).send(e);
	}
});

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

router.get("/sendVerify", auth, async (req, res) => {
	try {
		req.user.sendVerificationEmail(2);
		res.send();
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;
