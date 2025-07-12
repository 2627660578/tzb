import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 字符串简写写法
      // '/foo': 'http://localhost:4567',
      // 选项写法
      '/api': {
        target: 'http://43.142.192.78:8000', // 目标后端服务地址
        changeOrigin: true, // 需要虚拟主机站点
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径，去掉 /api 前缀
      },
    }
  }
})
