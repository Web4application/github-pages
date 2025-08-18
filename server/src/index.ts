import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenerativeAI } from "google-generative-ai";
import { requireAuth } from "./auth";
import { RAG } from "./rag";

const PORT = process.env.PORT || 8787;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash"; // fast + cheap
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
const rag = new RAG(process.env.GOOGLE_API_KEY as string);

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// --- RAG: upload (txt/pdf)
const upload = multer();
app.post("/api/rag/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const docId = `${(req as any).uid}-${Date.now()}`;
    const info = await rag.indexDoc(docId, req.file.buffer, req.file.originalname);
    res.json({ ok: true, ...info });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "upload failed" });
  }
});

// --- RAG: search
app.get("/api/rag/search", requireAuth, async (req, res) => {
  try {
    const q = String(req.query.q || "");
    const results = await rag.searchWithVector(q, 5);
    res.json({ q, results });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "search failed" });
  }
});

// --- Chat (SSE streaming), pulls top-k RAG context automatically
app.post("/api/chat/stream", requireAuth, async (req, res) => {
  const { message, history = [] } = req.body || {};
  if (!message) return res.status(400).json({ error: "message required" });

  // Prepare SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });

  function send(data: any) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  try {
    // 1) Pull RAG snippets
    const ragResults = await rag.searchWithVector(message, 5);
    const contextBlock =
      ragResults.length
        ? `\n\nRelevant context:\n${ragResults.map(r => `- ${r.text}`).join("\n\n")}\n\n`
        : "";

    // 2) Build prompt (history + user + context)
    const convo = [
      ...history.map((h: any) => ({ role: h.role, parts: [{ text: h.content }] })),
      { role: "user", parts: [{ text: `${message}\n${contextBlock}` }] }
    ];

    // 3) Stream from Gemini
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const stream = await model.generateContentStream({ contents: convo });

    for await (const chunk of stream.stream) {
      const text = chunk.text();
      if (text) send({ type: "delta", text });
    }
    send({ type: "done" });
    res.end();
  } catch (e: any) {
    send({ type: "error", error: e?.message || "generation failed" });
    res.end();
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on :${PORT}`);
});
