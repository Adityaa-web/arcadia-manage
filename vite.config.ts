export default {
  // Minimal Vite config for HTML project
  root: '.',
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