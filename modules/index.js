// modules/index.js
// Este arquivo serve como um ponto central para exportar todos os módulos

const embedBuilder = require('./embedBuilder');
const templateManager = require('./templateManager');
const webhookManager = require('./webhookManager');
const logSystem = require('./logSystem');

module.exports = {
  embedBuilder,
  templateManager,
  webhookManager,
  logSystem
};
