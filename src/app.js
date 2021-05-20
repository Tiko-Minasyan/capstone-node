require("dotenv").config({
	path: "./config/dev.env",
});
require("./db/mongoose");
const cors = require("cors");
const express = require("express");
const app = express();

const users = require("./users/users.controller");
const { handleError } = require("./middlewares/error-handler");
const authMiddleware = require("./middlewares/auth");

app.use(cors());
app.use(express.json());

app.use(
	authMiddleware.unless({
		path: ["/users/login", "/users/register"],
	})
);

app.use("/users", users);

app.use(handleError);

module.exports = app;
