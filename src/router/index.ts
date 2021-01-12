import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/layout/index.vue";
import Console from "../views/main/Console.vue";
import JobList from "../views/main/JobList.vue";
import LogShow from "../views/main/LogShow.vue";
import Login from "../views/auth/Login.vue"
import store from "../utils/store"
import api from "../utils/request"
const routes = [
  {
    path: "/",
    name: "Home",
    redirect: '/jobs',
    component: Home,
    meta: {
      required: true,
    },
    children: [
      { path: "/jobs", component: JobList },
      { path: "/logs", component: LogShow },
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.required) {
    if (localStorage.token) {
      store.commit('setToken', localStorage.token)
      api.defaults.auth = {
        username: store.state.token,
        password: store.state.token
      }
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})

export default router;