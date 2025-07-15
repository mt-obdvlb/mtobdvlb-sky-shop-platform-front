import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import uViewPlus from 'uview-plus'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  app.use(uViewPlus)
  return {
    app
  }
}
