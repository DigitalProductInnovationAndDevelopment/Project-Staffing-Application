module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'index.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
