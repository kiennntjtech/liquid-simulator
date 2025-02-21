module.exports = {
  apps: [
    {
      name: 'ra-admin-service',
      script: 'dist/main.js',

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: '',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      log_type: 'json',
      node_args: ['--max_old_space_size=8192'],
    },
  ],

  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
