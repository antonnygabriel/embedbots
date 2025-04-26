// commands/configurarLogs.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType } = require('discord.js');
const { setAdminLogWebhook, setGuildLogWebhook, sendAdminLog } = require('../modules/logSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('configurar_logs')
    .setDescription('Configura o sistema de logs administrativos (apenas para o dono do bot)'),
  
  async execute(interaction) {
    // Primeiro, precisamos buscar a aplicação para obter o dono
    await interaction.client.application.fetch();
    
    // Verificar se o usuário é o dono do bot
    const isOwner = interaction.client.application.owner 
      ? interaction.user.id === interaction.client.application.owner.id 
      : false;
      
    if (!isOwner) {
      await interaction.reply({
        content: '❌ Apenas o dono do bot pode configurar logs administrativos!',
        ephemeral: true
      });
      return;
    }
    
    const modal = new ModalBuilder()
      .setCustomId(`admin_logs_modal_${interaction.user.id}`)
      .setTitle('Configurar Logs Administrativos');
    
    const webhookUrlInput = new TextInputBuilder()
      .setCustomId('admin_webhook_url')
      .setLabel('URL do Webhook para Logs')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('https://discord.com/api/webhooks/...')
      .setRequired(true);
    
    const actionRow = new ActionRowBuilder().addComponents(webhookUrlInput);
    modal.addComponents(actionRow);
    
    await interaction.showModal(modal);
    
    try {
      const filter = i => i.customId === `admin_logs_modal_${interaction.user.id}`;
      const modalInteraction = await interaction.awaitModalSubmit({ 
        filter, 
        time: 120000 
      });
      
      const webhookUrl = modalInteraction.fields.getTextInputValue('admin_webhook_url');
      
      try {
        setAdminLogWebhook(webhookUrl);
        
        await modalInteraction.reply({
          content: '✅ Webhook para logs administrativos configurado com sucesso!',
          ephemeral: true
        });
        
        // Enviar um log de teste
        sendAdminLog({
          title: 'Sistema de Logs Ativado',
          description: 'O sistema de logs administrativos foi configurado com sucesso!',
          color: '#43B581',
          fields: [
            { name: 'Configurado por', value: interaction.user.tag },
            { name: 'Data', value: new Date().toLocaleString('pt-BR') }
          ]
        });
      } catch (error) {
        console.error('Erro ao configurar webhook:', error);
        await modalInteraction.reply({
          content: '❌ Erro ao configurar webhook! Verifique a URL e tente novamente.',
          ephemeral: true
        });
      }
    } catch (error) {
      console.error('Erro ao processar modal ou tempo esgotado:', error);
    }
  },
};
