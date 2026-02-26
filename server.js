const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// 🔹 Проверка сервера
app.get("/", (req, res) => {
  res.send("Сервер М.Фото работает! Используй /upload для загрузки фото.");
});

// 🔹 Загрузка фото
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) throw new Error("Файл не получен");

    const token = process.env.YA_TOKEN;
    if (!token) throw new Error("Токен Яндекс.Диска не настроен!");

    const fileName = `MPhoto_${Date.now()}.jpg`;

    const uploadLinkRes = await axios.get(
      `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${fileName}`,
      { headers: { Authorization: `OAuth ${token}` } }
    );

    const uploadUrl = uploadLinkRes.data.href;
    await axios.put(uploadUrl, req.file.buffer, {
      headers: { "Content-Type": "image/jpeg" }
    });

    res.json({ success: true, fileName });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

// 🔹 Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on", PORT));