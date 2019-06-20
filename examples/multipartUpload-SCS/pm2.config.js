module.exports = {
  apps: [
    {
      name: 'sendMail',
      script: './dist/src/app.js',
      kill_timeout: 10000,
      max_memory_restart: '1024M',
      watch: false,
      env: {
        NODE_ENV: 'prod',
        PORT: '18001',
        NODE_APP_INSTANCE: '0'
      }
    }
  ]
};
