import { createApp } from 'vue'
import './styles/index.scss'
import App from './app.vue'

function bootstrap() {
    const app = createApp(App)
    app.mount('#app')
}
bootstrap()
