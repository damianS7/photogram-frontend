import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import DashboardView from "@/views/admin/Dashboard.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import ResetPasswordView from "@/views/auth/password/reset/ResetPasswordView.vue";
import SettingsLayout from "@/layouts/SettingsLayout.vue";
import ProfileView from "@/views/settings/profile/ProfileView.vue";
import AccountView from "@/views/settings/account/AccountView.vue";
import FeedView from "@/views/feed/FeedView.vue";
import { useAuthStore } from "@/stores/auth";
import NotificationsView from "@/views/settings/notifications/NotificationsView.vue";
import PrivacyView from "@/views/settings/privacy/PrivacyView.vue";
import SecurityView from "@/views/settings/security/SecurityView.vue";
import ActivateView from "@/views/auth/activation/ActivateView.vue";
import RequestActivationTokenView from "@/views/auth/activation/ResendActivationView.vue";
import ResendActivationView from "@/views/auth/activation/ResendActivationView.vue";

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
    meta: { requiresAuth: true },
    children: [
      {
        path: "profile",
        name: "settings-profile",
        component: ProfileView,
      },
      {
        path: "notifications",
        name: "settings-notifications",
        component: NotificationsView,
      },
      {
        path: "account",
        name: "settings-account",
        component: AccountView,
      },
      {
        path: "privacy",
        name: "settings-privacy",
        component: PrivacyView,
      },
      {
        path: "security",
        name: "settings-security",
        component: SecurityView,
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
        path: "activate-account/:token?",
        name: "activate-account",
        component: ActivateView,
      },
      {
        path: "resend-activation",
        name: "resend-activation",
        component: ResendActivationView,
      },
      {
        path: "reset-password/:token?",
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
  const authStore = useAuthStore();
  if (!authStore.initialized) {
    await authStore.initialize();
  }
  const isAuthenticated = authStore.isAuthenticated;

  // if authentication is required but you are not logged
  if (to.meta.requiresAuth && !isAuthenticated) {
    // redirect to login
    return next({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
  }

  // if you access to /auth being logged ...
  if (to.path.includes("/auth") && isAuthenticated) {
    // redirects to /
    return next({
      path: "/",
    });
  }

  // from now on you are authenticated
  // if the route requires a role ...
  if (to.meta.role) {
    // get the user role
    const role = authStore.getPayload()?.role || "USER";

    // compare them
    if (role !== to.meta.role) {
      return next({
        path: "/404",
      });
    }
  }

  next();
});

export default router;
