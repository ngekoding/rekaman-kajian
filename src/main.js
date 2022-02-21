import { createApp } from 'vue'
import App from './App.vue'
import VueGtag from 'vue-gtag'

import './styles/tailwind.css'

const app = createApp(App)

app.use(VueGtag, {
  config: {
    id: 'G-HPW7YZV0B2',
    params: {
      send_page_view: false,
    }
  },
  enabled: import.meta.env.PROD
})

app.mount('#app')
