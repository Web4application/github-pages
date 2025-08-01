<template>
  <div id="app">
    <!-- Navbar -->
    <header class="navbar">
      <div class="logo">Web4App</div>
      <nav>
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#solutions">Solutions</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="https://app.web4app.io" target="_blank" class="cta-button">Launch</a></li>
        </ul>
      </nav>
    </header>

    <!-- Hero -->
    <section class="hero">
      <h1>Where AI Meets the Future of the Web</h1>
      <p>Empowering decentralized intelligence for the Web4 generation. Fast. Secure. Unstoppable.</p>
      <a href="https://app.web4app.io" target="_blank" class="cta-button">Launch Web4App</a>
    </section>

    <!-- Features -->
    <section id="features" class="features">
      <h2>What Web4App Offers</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>AI-Driven Engines</h3>
          <p>Deploy LLM-powered bots and autonomous agents with ease.</p>
        </div>
        <div class="feature-card">
          <h3>Web3 Integration</h3>
          <p>Built for Fadaka, NFTs, DAOs, and data sovereignty.</p>
        </div>
        <div class="feature-card">
          <h3>Lightning Deployment</h3>
          <p>Run anywhere: Fly.io, Docker, Railway, or your own node.</p>
        </div>
      </div>
    </section>

    <!-- Solutions -->
    <section id="solutions" class="solutions">
      <h2>Use Cases</h2>
      <ul>
        <li>🧠 Autonomous AI Workspaces</li>
        <li>🔗 Blockchain-enabled Knowledge Graphs</li>
        <li>📊 Real-time Agent-Based Analytics</li>
      </ul>
    </section>

    <!-- About -->
    <section id="about" class="about">
      <h2>About Web4App.io</h2>
      <p>Web4App.io is a full-stack AI + Web3 toolkit built for developers who don’t wait for the future — they build it.</p>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2025 Web4App. All rights reserved.</p>
      <div class="socials">
        <a href="#">GitHub</a>
        <a href="#">Docs</a>
        <a href="#">Contact</a>
      </div>
    </footer>

    <!-- Lola Chat -->
    <div id="lola-chat" class="lola-box">
      <div class="lola-header">Lola — Web4App AI</div>
      <div class="lola-log" ref="chatLog">
        <div><strong>Lola:</strong> Hello 👋! I'm Lola, your Web4App AI assistant. Ask me anything.</div>
        <div v-for="(msg, i) in messages" :key="i" v-html="msg"></div>
      </div>
      <form @submit.prevent="sendMessage" class="lola-form">
        <input v-model="input" type="text" placeholder="Ask Lola..." />
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      messages: []
    };
  },
  methods: {
    async sendMessage() {
      const prompt = this.input.trim();
      if (!prompt) return;
      this.messages.push(`<strong>You:</strong> ${prompt}`);
      this.input = '';
      this.scrollToBottom();

      try {
        const res = await fetch('https://api.web4app.io/lola-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        this.messages.push(`<strong>Lola:</strong> ${data.reply}`);
      } catch (e) {
        this.messages.push(`<strong>Lola:</strong> ⚠️ Could not reach AI server.`);
      }
      this.scrollToBottom();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.chatLog;
        el.scrollTop = el.scrollHeight;
      });
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background: #0e0e0e;
  color: #f2f2f2;
}
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #111;
  position: sticky;
  top: 0;
  z-index: 10;
}
.logo {
  font-weight: bold;
  font-size: 1.5rem;
  color: #61dafb;
}
.navbar ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}
.navbar a {
  color: white;
  text-decoration: none;
}
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #111, #1f1f1f);
}
.hero h1 {
  font-size: 2.5rem;
  background: linear-gradient(90deg, #00ffe1, #61dafb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero p {
  max-width: 600px;
  margin: 1rem auto;
  color: #bbb;
}
.cta-button {
  display: inline-block;
  margin-top: 1rem;
  background: #61dafb;
  color: #000;
  padding: 0.75rem 2rem;
  border-radius: 30px;
  font-weight: bold;
  text-decoration: none;
}
.features, .solutions, .about {
  padding: 2rem;
  text-align: center;
}
.features-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
.feature-card {
  background: #1c1c1c;
  padding: 1rem;
  border-radius: 10px;
  max-width: 300px;
}
.footer {
  text-align: center;
  padding: 2rem;
  background: #111;
  color: #999;
}
.footer .socials a {
  margin: 0 0.5rem;
  color: #61dafb;
}

/* Lola Styles */
.lola-box {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background: #1f1f1f;
  border-radius: 12px;
  box-shadow: 0 0 15px #61dafb;
  font-family: 'Segoe UI', sans-serif;
  overflow: hidden;
  z-index: 1000;
}
.lola-header {
  background: #111;
  padding: 0.75rem;
  font-weight: bold;
  color: #61dafb;
}
.lola-log {
  height: 200px;
  overflow-y: auto;
  padding: 1rem;
  font-size: 0.9rem;
  color: #eee;
}
.lola-form {
  display: flex;
  border-top: 1px solid #333;
}
.lola-form input {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: #0e0e0e;
  color: white;
}
.lola-form button {
  background: #61dafb;
  border: none;
  padding: 0.5rem 1rem;
  color: #000;
}

/* Mobile */
@media (max-width: 600px) {
  .lola-box {
    width: 100%;
    right: 0;
    bottom: 0;
    border-radius: 0;
  }
  .navbar ul {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
<script setup lang="ts">
import MigrationPage from './components/MigrationPage.vue'
</script>
