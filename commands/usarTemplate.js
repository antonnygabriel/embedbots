// commands/usarTemplate.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { startEmbedSession } = require('../modules/embedBuilder');
const { loadGuildTemplates } = require('../modules/templateManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('usar_template')
    .setDescription('Usa um template de embed salvo')
    .addStringOption(option =>
      option.setName('nome')
        .setDescription('Nome do template')
        .setRequired(true)),
  
  async execute(client, interaction) {
    const templateName = interaction.options.getString('nome');
    const templates = loadGuildTemplates(interaction.guildId);
    
    if (templates.has(templateName)) {
      await startEmbedSession(client, interaction, templateName);
    } else {
      await interaction.reply({
        content: `❌ Template **${templateName}** não encontrado! Use \`/listar_templates\` para ver os disponíveis.`,
        ephemeral: true
      });
    }
  },
};
