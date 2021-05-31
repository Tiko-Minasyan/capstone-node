const nodemailer = require("nodemailer");

module.exports = (email, name, surname, value, action = "register") => {
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASS,
		},
	});

	let message;

	if (action === "register") {
		message = `<b>Hello, ${name} ${surname}!</b>
			<p>Welcome to Medical Center Application!</p>
			<p>Your new password for logging in is ${value}. Please update your password after you log in.</p>
			<p>If you received this email by mistake, please simply ignore it.</p>`;
	}
	if (action === "recovery") {
		message = `<b>Hello, ${name} ${surname}!</b>
			<p>Your password recovery code is ${value}.</p>`;
	}

	transporter.sendMail({
		from: '"Administration of Medical Center Application" <tigrancho2000@gmail.com>',
		to: email,
		subject:
			action === "register"
				? "Welcome to Medical Center Application!"
				: "Recover your password",
		text: "New password: " + value,
		html: message,
	});
};
