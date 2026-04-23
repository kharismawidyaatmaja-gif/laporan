import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
    const { kegiatan, lokasi, masalah } = req.body;

    const prompt = `Buat laporan PPL.
    Kegiatan: ${kegiatan}
    Lokasi: ${lokasi}
    Permasalahan: ${masalah}
    Format JSON: {"deskripsi":"", "upaya":[]}`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        res.json(data);

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(3000, () => {
    console.log("Server jalan di http://localhost:3000");
});
