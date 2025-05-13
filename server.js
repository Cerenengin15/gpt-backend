const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

const cors = require("cors");

app.use(cors({
  origin: ["http://localhost:3000","https://www.thewatchify.com"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));


// ✅ CORS Ayarı – sadece localhost:3000’e izin verir (React uygulaman)

// ✅ JSON parse
app.use(express.json());

// ✅ OpenAI API bağlantısı
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Ana chat endpoint
app.post("/chat", async (req, res) => {
  console.log("🟡 GİRİLDİ /chat endpoint");
  console.log("📥 req.body:", req.body);

  if (!req.body || !req.body.message) {
    return res.status(400).json({ error: "Mesaj eksik veya boş" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Sen Watchify platformunun akıllı asistanısın." },
        { role: "user", content: req.body.message }
      ],
    });

    const reply = completion.choices[0].message.content;
    console.log("✅ GPT cevabı:", reply);
    res.json({ reply });
  } catch (error) {
    console.error("❌ GPT HATASI:", error?.response?.data || error.message);
    res.status(500).json({
      error: "GPT çağrısı başarısız",
      detail: error.message
    });
  }
});

// ✅ Root endpoint test için (isteğe bağlı)
app.get("/", (req, res) => {
  res.send("✅ Watchify GPT Backend Aktif!");
});

// ✅ Portu 5050 olarak ayarla (5000 çakıştığı için)
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`🚀 GPT sunucusu çalışıyor: http://localhost:${PORT}`);
});
