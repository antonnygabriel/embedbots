// utils/buttonCollectors.js
const { ComponentType } = require('discord.js');
const { modalHandlers } = require('./modalHandlers');
const { updateEmbedPreview } = require('../modules/embedBuilder');

// Configurar coletor de interações para os botões
function setupButtonCollector(client, message, userId) {
  const collector = message.createMessageComponentCollector({ 
    componentType: ComponentType.Button,
    time: 900000 // 15 minutos
  });
  
  collector.on('collect', async interaction => {
    // Verificar se a interação é do dono da sessão
    if (interaction.user.id !== userId) {
      await interaction.reply({ 
        content: 'Este painel de embed pertence a outro usuário.', 
        ephemeral: true 
      });
      return;
    }
    
    const session = client.activeSessions.get(userId);
    if (!session) {
      await interaction.reply({ 
        content: 'Sessão de edição expirada. Use `/embed` para iniciar uma nova.', 
        ephemeral: true 
      });
      return;
    }
    
    // Lidar com diferentes botões
    switch (interaction.customId) {
      case 'edit_title':
        modalHandlers.showTitleModal(client, interaction, session);
        break;
        
      case 'edit_description':
        modalHandlers.showDescriptionModal(client, interaction, session);
        break;
        
      case 'edit_color':
        modalHandlers.showColorModal(client, interaction, session);
        break;
        
      case 'edit_image':
        modalHandlers.showImageModal(client, interaction, session);
        break;
        
      case 'edit_thumbnail':
        modalHandlers.showThumbnailModal(client, interaction, session);
        break;
        
      case 'edit_author':
        modalHandlers.showAuthorModal(client, interaction, session);
        break;
        
      case 'edit_footer':
        modalHandlers.showFooterModal(client, interaction, session);
        break;
        
      case 'add_field':
        modalHandlers.showFieldModal(client, interaction, session);
        break;
        
      case 'toggle_timestamp':
        session.embedData.timestamp = !session.embedData.timestamp;
        await updateEmbedPreview(client, interaction, session);
        break;
        
      case 'clear_fields':
        session.embedData.fields = [];
        await updateEmbedPreview(client, interaction, session);
        break;
        
      case 'save_template':
        modalHandlers.showSaveTemplateModal(client, interaction, session);
        break;
        
      case 'select_channel':
        await modalHandlers.showChannelSelector(client, interaction, session);
        break;
        
      case 'setup_webhook':
        modalHandlers.showWebhookModal(client, interaction, session);
        break;
        
      case 'send_embed':
        await modalHandlers.sendFinalEmbed(client, interaction, session);
        break;
    }
  });
  
  collector.on('end', () => {
    // Limpar a sessão quando o coletor terminar
    client.activeSessions.delete(userId);
  });
}

module.exports = {
  setupButtonCollector
};
