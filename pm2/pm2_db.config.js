// Docs: http://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = {
  apps: [
    {
      name: 'crate-docker',
      script: 'docker-compose',
      args: 'up',
      interpreter: 'none', // https://github.com/Unitech/pm2/issues/471#issuecomment-269921690
      watch: true,
      restart_delay: 1000,
    },
    {
      name: 'python-gql', // TODO: v/bin/init_db is not done yet, this causes an error
      script: 'v/bin/server',
      interpreter: 'python', // https://github.com/Unitech/pm2/issues/292#issuecomment-56526191
      watch: true,
      restart_delay: 1000,
    },
  ],
};
