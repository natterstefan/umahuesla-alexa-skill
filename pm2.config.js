// Docs: http://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = {
  apps: [
    {
      name: 'alexa',
      script: 'npm',
      args: 'run start:alexa',
      watch: true,
      restart_delay: 1000,
      // instances: 4, // not needed, but for demo purposes put here
      // exec_mode: "cluster" // not needed, but for demo purposes put here
    },
    {
      name: 'server',
      script: 'npm',
      args: 'run start:server',
      watch: true,
      restart_delay: 1000,
    },
    {
      name: 'localtunnel',
      script: 'npm',
      args: 'run localtunnel',
      watch: true,
      restart_delay: 1000,
    },
  ],
};
