const { WebhookClient } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Diretório para configurações de webhooks
const WEBHOOKS_DIR = path.join(__dirname, '..', 'webhooks');
if (!fs.existsSync(WEBHOOKS_DIR)) {
  try {
    fs.mkdirSync(WEBHOOKS_DIR, { recursive: true });
    console.log(`Diretório de webhooks criado: ${WEBHOOKS_DIR}`);
  } catch (error) {
    console.error(`Erro ao criar diretório de webhooks: ${error.message}`);
  }
}

// Arquivo de configuração para webhooks
const WEBHOOK_CONFIG_PATH = path.join(WEBHOOKS_DIR, 'webhookConfig.json');

// Inicializar configuração
let webhookConfig = {
  guildWebhooks: {}
};

// Carregar configuração existente
function loadWebhookConfig() {
  if (fs.existsSync(WEBHOOK_CONFIG_PATH)) {
    try {
      const data = fs.readFileSync(WEBHOOK_CONFIG_PATH, 'utf8');
      webhookConfig = JSON.parse(data);
      console.log('Configuração de webhooks carregada com sucesso');
    } catch (error) {
      console.error(`Erro ao carregar configuração de webhooks: ${error.message}`);
      // Criar backup do arquivo corrompido
      const backupPath = `${WEBHOOK_CONFIG_PATH}.bak.${Date.now()}`;
      try {
        fs.copyFileSync(WEBHOOK_CONFIG_PATH, backupPath);
        console.log(`Backup do arquivo de configuração criado: ${backupPath}`);
      } catch (backupError) {
        console.error(`Erro ao criar backup: ${backupError.message}`);
      }
    }
  } else {
    saveWebhookConfig();
    console.log('Novo arquivo de configuração de webhooks criado');
  }
}

// Carregar configuração ao inicializar o módulo
loadWebhookConfig();

// Salvar configuração
function saveWebhookConfig() {
  try {
    fs.writeFileSync(WEBHOOK_CONFIG_PATH, JSON.stringify(webhookConfig, null, 2));
    return true;
  } catch (error) {
    console.error(`Erro ao salvar configuração de webhooks: ${error.message}`);
    return false;
  }
}

/**
 * Salva webhook para um servidor
 * @param {string} guildId - ID do servidor
 * @param {string} channelId - ID do canal
 * @param {Object} webhookData - Dados do webhook
 * @returns {boolean} - Sucesso da operação
 */
function saveGuildWebhook(guildId, channelId, webhookData) {
  if (!guildId || !channelId || !webhookData) {
    console.error('Parâmetros inválidos para saveGuildWebhook');
    return false;
  }
  
  if (!webhookConfig.guildWebhooks[guildId]) {
    webhookConfig.guildWebhooks[guildId] = {};
  }
  
  webhookConfig.guildWebhooks[guildId][channelId] = webhookData;
  return saveWebhookConfig();
}

/**
 * Obtém webhook de um servidor
 * @param {string} guildId - ID do servidor
 * @param {string} channelId - ID do canal
 * @returns {Object|null} - Dados do webhook ou null se não encontrado
 */
function getGuildWebhook(guildId, channelId) {
  if (!guildId || !channelId) {
    console.error('Parâmetros inválidos para getGuildWebhook');
    return null;
  }
  
  if (!webhookConfig.guildWebhooks[guildId]) return null;
  return webhookConfig.guildWebhooks[guildId][channelId] || null;
}

/**
 * Remove webhook de um servidor
 * @param {string} guildId - ID do servidor
 * @param {string} channelId - ID do canal
 * @returns {boolean} - Sucesso da operação
 */
function removeGuildWebhook(guildId, channelId) {
  if (!guildId || !channelId) {
    console.error('Parâmetros inválidos para removeGuildWebhook');
    return false;
  }
  
  if (!webhookConfig.guildWebhooks[guildId]) return false;
  
  if (webhookConfig.guildWebhooks[guildId][channelId]) {
    delete webhookConfig.guildWebhooks[guildId][channelId];
    
    // Se não houver mais webhooks para este servidor, remova o servidor
    if (Object.keys(webhookConfig.guildWebhooks[guildId]).length === 0) {
      delete webhookConfig.guildWebhooks[guildId];
    }
    
    return saveWebhookConfig();
  }
  
  return false;
}

/**
 * Lista todos os webhooks de um servidor
 * @param {string} guildId - ID do servidor
 * @returns {Object|null} - Objeto com os webhooks do servidor
 */
function listGuildWebhooks(guildId) {
  if (!guildId) {
    console.error('Parâmetro inválido para listGuildWebhooks');
    return null;
  }
  
  return webhookConfig.guildWebhooks[guildId] || null;
}

/**
 * Envia mensagem via webhook
 * @param {string|Object} webhook - URL do webhook ou objeto com id e token
 * @param {Object} options - Opções da mensagem
 * @returns {Promise<Object|null>} - Resposta da API ou null em caso de erro
 */
async function sendWebhookMessage(webhook, options = {}) {
  if (!webhook) {
    console.error('Webhook não especificado');
    return null;
  }
  
  let webhookClient;
  
  try {
    // Verificar se webhook é uma URL ou um objeto com id e token
    if (typeof webhook === 'string') {
      webhookClient = new WebhookClient({ url: webhook });
    } else if (webhook.id && webhook.token) {
      webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });
    } else {
      throw new Error('Formato de webhook inválido');
    }
    
    // Construir payload
    const payload = {
      username: options.username,
      avatarURL: options.avatarURL,
      content: options.content,
      embeds: options.embeds,
      components: options.components,
      files: options.files,
      threadId: options.threadId,
      allowedMentions: options.allowedMentions || { parse: ['users', 'roles'] }
    };
    
    // Remover propriedades undefined
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) delete payload[key];
    });
    
    // Enviar mensagem
    const response = await webhookClient.send(payload);
    return response;
  } catch (error) {
    console.error(`Erro ao enviar mensagem via webhook: ${error.message}`);
    return null;
  }
}

/**
 * Edita mensagem enviada via webhook
 * @param {string|Object} webhook - URL do webhook ou objeto com id e token
 * @param {string} messageId - ID da mensagem a ser editada
 * @param {Object} options - Novas opções da mensagem
 * @returns {Promise<Object|null>} - Resposta da API ou null em caso de erro
 */
async function editWebhookMessage(webhook, messageId, options = {}) {
  if (!webhook || !messageId) {
    console.error('Webhook ou messageId não especificados');
    return null;
  }
  
  let webhookClient;
  
  try {
    // Verificar se webhook é uma URL ou um objeto com id e token
    if (typeof webhook === 'string') {
      webhookClient = new WebhookClient({ url: webhook });
    } else if (webhook.id && webhook.token) {
      webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });
    } else {
      throw new Error('Formato de webhook inválido');
    }
    
    // Construir payload
    const payload = {
      content: options.content,
      embeds: options.embeds,
      components: options.components,
      files: options.files,
      allowedMentions: options.allowedMentions || { parse: ['users', 'roles'] },
      threadId: options.threadId
    };
    
    // Remover propriedades undefined
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) delete payload[key];
    });
    
    // Editar mensagem
    const response = await webhookClient.editMessage(messageId, payload);
    return response;
  } catch (error) {
    console.error(`Erro ao editar mensagem via webhook: ${error.message}`);
    return null;
  }
}

/**
 * Deleta mensagem enviada via webhook
 * @param {string|Object} webhook - URL do webhook ou objeto com id e token
 * @param {string} messageId - ID da mensagem a ser deletada
 * @param {Object} options - Opções adicionais
 * @returns {Promise<boolean>} - Sucesso da operação
 */
async function deleteWebhookMessage(webhook, messageId, options = {}) {
  if (!webhook || !messageId) {
    console.error('Webhook ou messageId não especificados');
    return false;
  }
  
  let webhookClient;
  
  try {
    // Verificar se webhook é uma URL ou um objeto com id e token
    if (typeof webhook === 'string') {
      webhookClient = new WebhookClient({ url: webhook });
    } else if (webhook.id && webhook.token) {
      webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });
    } else {
      throw new Error('Formato de webhook inválido');
    }
    
    // Deletar mensagem
    await webhookClient.deleteMessage(messageId, options.threadId);
    return true;
  } catch (error) {
    console.error(`Erro ao deletar mensagem via webhook: ${error.message}`);
    return false;
  }
}

module.exports = {
  saveGuildWebhook,
  getGuildWebhook,
  removeGuildWebhook,
  listGuildWebhooks,
  sendWebhookMessage,
  editWebhookMessage,
  deleteWebhookMessage
};
