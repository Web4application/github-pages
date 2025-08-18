import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import { useAuth } from "../composables/useAuth";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { 
    path: "/dashboard", 
    name: "Dashboard", 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const { user } = useAuth();
  if (to.meta.requiresAuth && !user.value) {
    next("/login");
  } else {
    next();
  }
});

export default router;
