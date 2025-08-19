<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-2xl mb-4">Login</h1>
    <input v-model="email" type="email" placeholder="Email" class="mb-2 p-2 border"/>
    <input v-model="password" type="password" placeholder="Password" class="mb-2 p-2 border"/>
    <button @click="loginUser" class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    <button @click="registerUser" class="mt-2 text-sm underline">Register</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";

const { login, register } = useAuth();
const email = ref("");
const password = ref("");

const loginUser = async () => {
  try {
    await login(email.value, password.value);
    window.location.href = "/dashboard";
  } catch (err) {
    alert(err.message);
  }
};

const registerUser = async () => {
  try {
    await register(email.value, password.value);
    window.location.href = "/dashboard";
  } catch (err) {
    alert(err.message);
  }
};
</script>
