const express = require("express");
const { pool } = require("../db");
const { authMiddleware } = require("../middleware/authMiddleware");

const propertiesRouter = express.Router();

propertiesRouter.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, type, location, price, area, beds, image_url AS image FROM properties ORDER BY created_at DESC"
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar imoveis" });
  }
});

propertiesRouter.post("/", authMiddleware, async (req, res) => {
  const { title, type, location, price, area, beds, image } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO properties (title, type, location, price, area, beds, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        title || null,
        type || null,
        location || null,
        price || null,
        area || null,
        beds || null,
        image || null,
      ]
    );

    return res.status(201).json({ id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao salvar imovel" });
  }
});

propertiesRouter.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, type, location, price, area, beds, image } = req.body;

  try {
    await pool.query(
      "UPDATE properties SET title = ?, type = ?, location = ?, price = ?, area = ?, beds = ?, image_url = ? WHERE id = ?",
      [
        title || null,
        type || null,
        location || null,
        price || null,
        area || null,
        beds || null,
        image || null,
        id,
      ]
    );

    return res.json({ message: "Atualizado" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar imovel" });
  }
});

propertiesRouter.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM properties WHERE id = ?", [id]);
    return res.json({ message: "Removido" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao remover imovel" });
  }
});

module.exports = { propertiesRouter };
