import './assets/main.css'
import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import i18n from './services/i18n'
import Vue3FormWizard from 'vue3-form-wizard'
import 'vue3-form-wizard/dist/style.css'


const pinia=createPinia()

watch(
  pinia.state,
  (state) => {
    localStorage.setItem("username", JSON.stringify(state.user));
    localStorage.setItem("userInfos",JSON.stringify(state.userDetails));
  },
  { deep: true }
);


const app = createApp(App)
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
      },
  })


app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(Vue3FormWizard)

i18n(app).mount('#app')
