import { createSSRApp } from 'vue'
import App from './App.vue'
import uViewPlus from 'uview-plus'
import pinia from '@/store'

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  app.use(uViewPlus)
  return {
    app
  }
}
