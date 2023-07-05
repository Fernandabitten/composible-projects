import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// import Store from "../pages/store.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "store",
    component: () => import("../pages/store.vue"),
  },
  {
    path: "/pomodoro",
    name: "pomodoro",
    component: () => import("../pages/pomodoro.vue"),
  },
  {
    path: "/picker",
    name: "picker",
    component: () => import("../pages/picker.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
