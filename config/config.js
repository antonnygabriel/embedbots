// config/config.js
module.exports = {
    token: process.env.TOKEN,
    prefix: '!',
    ownerId: process.env.OWNER_ID || '',
    defaultColor: '#0099ff',
    embedTimeout: 900000 // 15 minutos
  };
  