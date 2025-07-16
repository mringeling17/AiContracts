module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'run dev',
      env: {
        HOST: '0.0.0.0',
        PORT: 5173
      }
    },
    {
      name: 'api',
      script: 'server/index.js'
    },
    {
      name: 'hardhat',
      script: 'npx',
      args: 'hardhat node --hostname 0.0.0.0'
    }
  ]
};
