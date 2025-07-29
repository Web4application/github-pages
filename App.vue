<template>
  <div class="migration-page">
    <h1>Migrating from VitePress 0.x</h1>
    <p>This guide will help you upgrade your existing VitePress 0.x project to VitePress 1.0.</p>

    <h2>Update Dependencies</h2>
    <pre><code>npm install vitepress@latest</code></pre>

    <h2>Replace Theme API</h2>
    <p>The <code>enhanceApp</code> function is now called <code>setup</code>. Rename it in your theme entry file:</p>

    <pre><code>
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'

export default {
  ...DefaultTheme,
  setup() {
    // your code here
  }
}
    </code></pre>

    <h2>Update Markdown Files</h2>
    <ul>
      <li>Use new frontmatter format</li>
      <li>Update custom components if necessary</li>
    </ul>

    <h2>Run the Dev Server</h2>
    <pre><code>npx vitepress dev</code></pre>

    <h2>Build for Production</h2>
    <pre><code>npx vitepress build</code></pre>

    <h2>Deploy</h2>
    <p>Upload the contents of <code>.vitepress/dist</code> to your static hosting platform.</p>
  </div>
</template>

<script setup lang="ts">
// Add logic if needed in the future
</script>

<style scoped>
.migration-page {
  font-family: Arial, sans-serif;
  padding: 2rem;
  line-height: 1.6;
}

h1, h2 {
  color: #2c3e50;
}

pre {
  background: #f5f5f5;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
}

code {
  font-family: 'Source Code Pro', monospace;
  background-color: #eee;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

ul {
  padding-left: 1.5rem;
}
</style>
