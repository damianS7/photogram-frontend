import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import DashboardView from "@/views/admin/Dashboard.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import ResetPasswordView from "@/views/auth/ResetPasswordView.vue";
import SettingsLayout from "@/layouts/SettingsLayout.vue";
import ProfileView from "@/views/settings/profile/ProfileView.vue";
import AccountView from "@/views/settings/account/AccountView.vue";
import FeedView from "@/views/feed/FeedView.vue";
import { useAuthStore } from "@/stores/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/",
        name: "feed",
        component: FeedView,
      },
      {
        path: "/@:username?",
        name: "user-feed",
        component: FeedView,
        props: true, // allows passing route params as props
      },
      {
        path: "profile",
        name: "profile",
        component: ProfileView,
      },
    ],
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsLayout,
    redirect: "/settings/profile",
    children: [
      {
        path: "profile",
        name: "settings-profile",
        component: ProfileView,
      },
      {
        path: "account",
        name: "settings-account",
        component: AccountView,
      },
      {
        path: "privacy",
        name: "settings-privacy",
        component: AccountView,
      },
      {
        path: "notifications",
        name: "settings-notifications",
        component: AccountView,
      },
      {
        path: "security",
        name: "settings-security",
        component: AccountView,
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
    meta: { requiresAuth: true, role: "ADMIN" },
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

router.beforeEach(async (to, _from, next) => {
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  // auth required from here
  const authStore = useAuthStore();
  if (!authStore.initialized) {
    await authStore.initialize();
  }

  const isAuthenticated = authStore.isAuthenticated;

  // Check if the route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // if not authenticated, redirect to login
    return next({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
  }

  // authenticated from here
  const role = authStore.getPayload()?.role || "USER";
  // Check if the route requires admin role
  if (to.meta.role && to.meta.role !== role) {
    return next({
      path: "/",
    });
  }

  // If the user is authenticated, allow access to the route
  next();
});

export default router;
