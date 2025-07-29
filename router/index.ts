// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import MigrationPage from '../components/MigrationPage.vue'

const routes = [
  { path: '/', component: MigrationPage },
  { path: '/migration', component: MigrationPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
