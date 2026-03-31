const express = require("express");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/auth");

const authRouter = express.Router();

const adminEmail = process.env.ADMIN_EMAIL;
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha obrigatorios" });
  }

  if (email !== adminEmail) {
    return res.status(401).json({ message: "Credenciais invalidas" });
  }

  const isValid = await bcrypt.compare(password, adminPasswordHash || "");
  if (!isValid) {
    return res.status(401).json({ message: "Credenciais invalidas" });
  }

  const token = generateToken({ email });
  return res.json({ token });
});

module.exports = { authRouter };
