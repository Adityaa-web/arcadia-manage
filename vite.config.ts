export default {
  // Minimal Vite config for HTML project
  root: '.',
  server: {
    port: 8080
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        login: './login.html',
        signup: './signup.html',
        student: './student-dashboard.html'
      }
    }
  }
}