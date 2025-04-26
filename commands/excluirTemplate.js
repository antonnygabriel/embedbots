// commands/excluirTemplate.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { deleteGuildTemplate } = require('../modules/templateManager');
const { sendGuildLog } = require('../modules/logSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('excluir_template')
    .setDescription('Exclui um template de embed')
    .addStringOption(option =>
      option.setName('nome')
        .setDescription('Nome do template a ser excluído')
        .setRequired(true)),
  
  async execute(client, interaction) {
    const templateName = interaction.options.getString('nome');
    
    const success = deleteGuildTemplate(interaction.guildId, templateName);
    
    if (success) {
      await interaction.reply({
        content: `✅ Template **${templateName}** excluído com sucesso!`,
        ephemeral: true
      });
      
      // Enviar log para o servidor
      sendGuildLog(interaction.guildId, {
        title: 'Template Excluído',
        description: `Um template de embed foi excluído`,
        color: '#F04747',
        fields: [
          { name: 'Nome do Template', value: templateName },
          { name: 'Excluído por', value: interaction.user.tag }
        ]
      });
    } else {
      await interaction.reply({
        content: `❌ Template **${templateName}** não encontrado!`,
        ephemeral: true
      });
    }
  },
};
