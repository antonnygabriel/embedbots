// commands/listarTemplates.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { listGuildTemplates } = require('../modules/templateManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listar_templates')
    .setDescription('Lista todos os templates de embed disponíveis'),
  
  async execute(client, interaction) {
    const templatesList = listGuildTemplates(interaction.guildId);
    
    if (templatesList.length === 0) {
      await interaction.reply({
        content: '📝 Nenhum template salvo ainda neste servidor!',
        ephemeral: true
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle('📝 Templates de Embed Disponíveis')
        .setDescription(templatesList.map(name => `• \`${name}\``).join('\n'))
        .setColor('#0099ff')
        .setFooter({ text: `Total: ${templatesList.length} templates` });
      
      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }
  },
};
