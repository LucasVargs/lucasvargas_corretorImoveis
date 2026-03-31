const { verifyToken } = require("../utils/auth");

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token ausente" });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalido" });
  }
};

module.exports = { authMiddleware };
