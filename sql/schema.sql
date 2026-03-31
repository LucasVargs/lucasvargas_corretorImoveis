CREATE DATABASE IF NOT EXISTS lucasvargas;

USE lucasvargas;

CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120),
  type VARCHAR(80),
  location VARCHAR(120),
  price DECIMAL(12, 2),
  area INT,
  beds INT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
