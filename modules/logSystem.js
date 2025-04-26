// modules/logSystem.js
const { WebhookClient, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Diretório para configurações de logs
const LOGS_DIR = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR);
}

// Arquivo de configuração para webhooks de log
const LOG_CONFIG_PATH = path.join(LOGS_DIR, 'logConfig.json');

// Inicializar configuração
let logConfig = {
  adminLogWebhook: null,
  guildLogWebhooks: {}
};

// Carregar configuração existente
if (fs.existsSync(LOG_CONFIG_PATH)) {
  try {
    logConfig = JSON.parse(fs.readFileSync(LOG_CONFIG_PATH, 'utf8'));
  } catch (error) {
    console.error('Erro ao carregar configuração de logs:', error);
  }
}

// Salvar configuração
function saveLogConfig() {
  try {
    fs.writeFileSync(LOG_CONFIG_PATH, JSON.stringify(logConfig, null, 2));
  } catch (error) {
    console.error('Erro ao salvar configuração de logs:', error);
  }
}

// Webhook client para logs administrativos
let adminWebhook = null;
if (logConfig.adminLogWebhook) {
  adminWebhook = new WebhookClient({ url: logConfig.adminLogWebhook });
}

// Função para configurar webhook de logs administrativos
function setAdminLogWebhook(webhookUrl) {
  logConfig.adminLogWebhook = webhookUrl;
  adminWebhook = new WebhookClient({ url: webhookUrl });
  saveLogConfig();
  return adminWebhook;
}

// Função para enviar logs administrativos
async function sendAdminLog(options) {
  if (!adminWebhook) return false;
  
  try {
    const embed = new EmbedBuilder()
      .setColor(options.color || '#2F3136')
      .setTitle(options.title || 'Log Administrativo')
      .setDescription(options.description || '')
      .setTimestamp();
    
    if (options.fields) {
      embed.addFields(options.fields);
    }
    
    if (options.thumbnail) {
      embed.setThumbnail(options.thumbnail);
    }
    
    if (options.footer) {
      embed.setFooter(options.footer);
    }
    
    await adminWebhook.send({
      username: options.username || 'Sistema de Logs',
      avatarURL: options.avatarURL || 'https://i.imgur.com/AfFp7pu.png',
      embeds: [embed]
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar log administrativo:', error);
    return false;
  }
}

// Configurar webhook de logs para um servidor específico
function setGuildLogWebhook(guildId, webhookUrl) {
  logConfig.guildLogWebhooks[guildId] = webhookUrl;
  saveLogConfig();
}

// Enviar log para um servidor específico
async function sendGuildLog(guildId, options) {
  const webhookUrl = logConfig.guildLogWebhooks[guildId];
  if (!webhookUrl) return false;
  
  try {
    const webhook = new WebhookClient({ url: webhookUrl });
    
    const embed = new EmbedBuilder()
      .setColor(options.color || '#2F3136')
      .setTitle(options.title || 'Log do Servidor')
      .setDescription(options.description || '')
      .setTimestamp();
    
    if (options.fields) {
      embed.addFields(options.fields);
    }
    
    if (options.thumbnail) {
      embed.setThumbnail(options.thumbnail);
    }
    
    if (options.footer) {
      embed.setFooter(options.footer);
    }
    
    await webhook.send({
      username: options.username || 'Sistema de Logs',
      avatarURL: options.avatarURL || 'https://i.imgur.com/AfFp7pu.png',
      embeds: [embed]
    });
    
    return true;
  } catch (error) {
    console.error(`Erro ao enviar log para o servidor ${guildId}:`, error);
    return false;
  }
}

module.exports = {
  setAdminLogWebhook,
  sendAdminLog,
  setGuildLogWebhook,
  sendGuildLog
};
