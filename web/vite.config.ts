const { defineConfig } = require('vite')
const { resolve } = require('path')
const vue =require('@vitejs/plugin-vue')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    script:{
      refSugar:true
    }
  })],
  root: process.cwd(),
  resolve: {
    alias: {
    "@":resolve(process.cwd(),"src")
  }},
  server: {
    host: "0.0.0.0",
    port: "8080",
    open:true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname,'index.html')
      }
    }
  }
})
