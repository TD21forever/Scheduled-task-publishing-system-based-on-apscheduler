import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router/'
import store from './utils/store'

const app = createApp(App)
app.use(ElementPlus, { locale })
app.use(VueAxios, axios)
app.use(router)
app.use(store)
app.mount("#app")
