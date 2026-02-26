const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

const YA_TOKEN = "y0__xD2tLQfGNuWAyC2z9LEFiWw8NqglZbBekKXqoY7hSKAkIP5";

app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = Date.now() + "_" + req.file.originalname;

    // Получаем ссылку для загрузки
    const uploadUrl = await axios.get(
      "https://cloud-api.yandex.net/v1/disk/resources/upload",
      {
        params: {
          path: `MPhoto/${fileName}`,
          overwrite: true,
        },
        headers: {
          Authorization: `OAuth ${YA_TOKEN}`,
        },
      }
    );

    // Загружаем файл
    await axios.put(uploadUrl.data.href, fs.readFileSync(filePath), {
      headers: { "Content-Type": "application/octet-stream" },
    });

    fs.unlinkSync(filePath);

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Ошибка загрузки" });
  }
});

app.listen(5000, () => console.log("Server started on 5000"));