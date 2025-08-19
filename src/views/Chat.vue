<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">AI Chat (Gemini + RAG)</h1>

    <div class="border rounded p-4 h-96 overflow-y-auto mb-4">
      <div v-for="(m,i) in messages" :key="i" class="mb-3">
        <div class="text-sm opacity-70">{{ m.role }}</div>
        <div class="whitespace-pre-wrap">{{ m.content }}</div>
      </div>
      <div v-if="streaming" class="whitespace-pre-wrap">
        <span class="text-sm opacity-70">assistant</span>
        <div>{{ streamBuffer }}</div>
      </div>
    </div>

    <form @submit.prevent="send" class="flex gap-2">
      <input v-model="input" class="flex-1 border rounded px-3 py-2" placeholder="Ask anything..." />
      <button class="px-4 py-2 border rounded" :disabled="sending">Send</button>
      <label class="px-3 py-2 border rounded cursor-pointer">
        Upload
        <input type="file" class="hidden" @change="onUpload" accept=".txt,.pdf" />
      </label>
    </form>

    <p class="text-xs opacity-70 mt-2">Docs improve answers via retrieval. Auth is required for chat & uploads.</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ssePost } from "../services/sse";
import { useAuth } from "../composables/useAuth";
import { useAuthToken } from "../composables/useAuthToken";

const { user } = useAuth();
const { idToken } = useAuthToken();

const input = ref("");
const messages = ref([{ role: "system", content: "You are a helpful assistant." }]);
const sending = ref(false);
const streaming = ref(false);
const streamBuffer = ref("");

async function send() {
  if (!user.value) { alert("Login required"); return; }
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  messages.value.push({ role: "user", content: text });
  sending.value = true; streaming.value = true; streamBuffer.value = "";

  try {
    const headers = { Authorization: `Bearer ${idToken.value}` };
    const body = { message: text, history: messages.value.slice(-10) }; // last 10 turns

    for await (const ev of ssePost("/api/chat/stream", body, headers)) {
      if (ev.type === "delta") streamBuffer.value += ev.text;
      if (ev.type === "done") {
        messages.value.push({ role: "assistant", content: streamBuffer.value });
        streamBuffer.value = "";
        streaming.value = false;
      }
      if (ev.type === "error") {
        alert(ev.error);
        streaming.value = false;
      }
    }
  } catch (e) {
    console.error(e);
    streaming.value = false;
  } finally {
    sending.value = false;
  }
}

async function onUpload(e) {
  if (!user.value) { alert("Login required"); e.target.value = ""; return; }
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/rag/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken.value}` },
      body: form
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || "upload failed");
    alert(`Indexed ${json.chunks} chunks from ${file.name}`);
  } catch (err) {
    alert(String(err));
  } finally {
    e.target.value = "";
  }
}
</script>
