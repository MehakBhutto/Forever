const express = require("express");
const { loginUser, registerUser, loginAdmin } = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.post("/admin", loginAdmin);

module.exports = userRouter;