import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HomeView from "@/views/Home.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import DashboardView from "@/views/admin/Dashboard.vue";
import LoginView from "@/views/auth/Login.vue";
import RegisterView from "@/views/auth/Register.vue";
import ResetPasswordView from "@/views/auth/ResetPassword.vue";
import SettingsView from "@/views/settings/Settings.vue";
import { useAuthStore } from "@/stores/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/",
        name: "home",
        component: HomeView,
      },
      {
        path: "settings",
        name: "settings",
        component: SettingsView,
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    redirect: "/auth/login",
    children: [
      {
        path: "login",
        name: "login",
        component: LoginView,
      },
      {
        path: "register",
        name: "register",
        component: RegisterView,
      },
      {
        path: "reset-password",
        name: "reset-password",
        component: ResetPasswordView,
      },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: "admin" },
    redirect: "/admin/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: DashboardView,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Check if the route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // if not authenticated, redirect to login
    next({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
  }

  // Check if the route requires admin role
  // FIXME: Extract role from token
  // if (to.meta.role && to.meta.role !== "admin") {
  //   next({
  //     path: "/",
  //     query: { redirect: to.fullPath },
  //   });
  // }

  // If the user is authenticated, allow access to the route
  next();
});

export default router;
