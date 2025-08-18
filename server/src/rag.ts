import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { GoogleGenerativeAI } from "google-generative-ai";
import { RagChunk } from "./types";

const DATA = path.join(__dirname, "..", "data", "embeddings.json");
const MODEL_EMB = "text-embedding-004";
const CHUNK_SIZE = 1200;   // ~ characters
const CHUNK_OVERLAP = 150;

let cache: RagChunk[] = [];
function load() {
  try { cache = JSON.parse(fs.readFileSync(DATA, "utf8")); } catch { cache = []; }
}
function save() {
  fs.mkdirSync(path.dirname(DATA), { recursive: true });
  fs.writeFileSync(DATA, JSON.stringify(cache, null, 2));
}
load();

function chunkText(text: string) {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + CHUNK_SIZE, text.length);
    chunks.push(text.slice(i, end));
    i = end - CHUNK_OVERLAP;
    if (i < 0) i = 0;
  }
  return chunks;
}

function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}

export class RAG {
  genAI: GoogleGenerativeAI;
  constructor(apiKey: string) { this.genAI = new GoogleGenerativeAI(apiKey); }

  async embed(texts: string[]): Promise<number[][]> {
    const emb = await this.genAI.embedContent({ model: MODEL_EMB, content: texts.join("\n") });
    // text-embedding-004 with single content returns one vector; we’ll call per-chunk
    return [emb.embedding.values as number[]];
  }

  async indexDoc(docId: string, buf: Buffer, filename: string) {
    // text extract
    let raw = "";
    if (filename.toLowerCase().endsWith(".pdf")) {
      const out = await pdf(buf);
      raw = out.text || "";
    } else {
      raw = buf.toString("utf8");
    }
    raw = raw.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n");

    const chunks = chunkText(raw).filter(Boolean);
    for (let i = 0; i < chunks.length; i++) {
      const text = chunks[i];
      const [vector] = await this.embed([text]);
      const item: RagChunk = {
        id: `${docId}-${i}`,
        docId,
        text,
        embedding: vector,
      };
      cache.push(item);
    }
    save();
    return { docId, chunks: chunks.length };
  }

  search(query: string, k = 5) {
    // embed query
    // NOTE: synchronous embedding isn’t available; caller should pass in vector
    throw new Error("Use searchWithVector");
  }

  async searchWithVector(query: string, k = 5) {
    const [qvec] = await this.embed([query]);
    const scored = cache.map(c => ({ c, score: cosine(qvec, c.embedding) }));
    scored.sort((a,b) => b.score - a.score);
    return scored.slice(0, k).map(s => ({ id: s.c.id, docId: s.c.docId, score: s.score, text: s.c.text }));
  }
}
