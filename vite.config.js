import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode == 'production' ? '/rekaman-kajian/' : '/',
    plugins: [
      vue(),
      Components({
        resolvers: [
          IconsResolver({
            prefix: 'i'
          }),
        ]
      }),
      Icons(),
    ],
    resolve: {
      alias: [
        {
          find: 'vue',
          replacement: 'vue/dist/vue.esm-bundler.js'
        },
        { 
          find: '@', 
          replacement: path.resolve(__dirname, './src')
        }
      ]
    },
  }
})
