require("dotenv").config();

const path = require("path");
const express = require("express");

const { pool } = require("./src/db");
const { authRouter } = require("./src/routes/auth");
const { propertiesRouter } = require("./src/routes/properties");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRouter);
app.use("/api/properties", propertiesRouter);

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const start = async () => {
  try {
    await pool.query("SELECT 1");
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Erro conectando ao MySQL:", error.message);
    process.exit(1);
  }
};

start();
