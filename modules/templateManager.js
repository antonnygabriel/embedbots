// modules/templateManager.js
const fs = require('fs');
const path = require('path');

// Diretório base para templates
const TEMPLATES_BASE_DIR = path.join(__dirname, '..', 'templates');
if (!fs.existsSync(TEMPLATES_BASE_DIR)) {
  fs.mkdirSync(TEMPLATES_BASE_DIR);
}

// Obter diretório de templates para um servidor específico
function getGuildTemplateDir(guildId) {
  const guildDir = path.join(TEMPLATES_BASE_DIR, guildId);
  if (!fs.existsSync(guildDir)) {
    fs.mkdirSync(guildDir);
  }
  return guildDir;
}

// Carregar templates de um servidor
function loadGuildTemplates(guildId) {
  const templates = new Map();
  const guildDir = getGuildTemplateDir(guildId);
  
  try {
    const files = fs.readdirSync(guildDir);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const templateData = JSON.parse(fs.readFileSync(path.join(guildDir, file), 'utf8'));
        const templateName = file.replace('.json', '');
        templates.set(templateName, templateData);
      }
    });
  } catch (error) {
    console.error(`Erro ao carregar templates do servidor ${guildId}:`, error);
  }
  
  return templates;
}

// Salvar template para um servidor
function saveGuildTemplate(guildId, name, data) {
  try {
    const guildDir = getGuildTemplateDir(guildId);
    fs.writeFileSync(path.join(guildDir, `${name}.json`), JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Erro ao salvar template ${name} para o servidor ${guildId}:`, error);
    return false;
  }
}

// Excluir template de um servidor
function deleteGuildTemplate(guildId, name) {
  try {
    const guildDir = getGuildTemplateDir(guildId);
    fs.unlinkSync(path.join(guildDir, `${name}.json`));
    return true;
  } catch (error) {
    console.error(`Erro ao excluir template ${name} do servidor ${guildId}:`, error);
    return false;
  }
}

// Listar templates de um servidor
function listGuildTemplates(guildId) {
  const templates = loadGuildTemplates(guildId);
  return Array.from(templates.keys());
}

module.exports = {
  loadGuildTemplates,
  saveGuildTemplate,
  deleteGuildTemplate,
  listGuildTemplates
};
