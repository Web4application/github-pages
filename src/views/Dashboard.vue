<template>
  <div class="p-8">
    <h1 class="text-3xl">Welcome to your Dashboard 🚀</h1>
    <p class="mt-2">Only logged-in users can see this.</p>
    <button @click="logoutUser" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">
      Logout
    </button>
  </div>
</template>

<script setup>
import { useAuth } from "../composables/useAuth";
const { logout } = useAuth();

const logoutUser = async () => {
  await logout();
  window.location.href = "/login";
};
</script>
