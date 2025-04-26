// modules/embedBuilder.js
const { 
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ComponentType,
    StringSelectMenuBuilder
  } = require('discord.js');
  
  const createEmbed = require('../utils/createEmbed');
  
  // Criar botões para o painel de edição
  function createEmbedControlButtons() {
    const row1 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('edit_title')
          .setLabel('📝 Título')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('edit_description')
          .setLabel('📄 Descrição')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('edit_color')
          .setLabel('🎨 Cor')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('edit_image')
          .setLabel('🖼️ Imagem')
          .setStyle(ButtonStyle.Primary)
      );
    
    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('edit_thumbnail')
          .setLabel('🏞️ Thumbnail')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('edit_author')
          .setLabel('👤 Autor')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('edit_footer')
          .setLabel('👣 Rodapé')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('add_field')
          .setLabel('➕ Campo')
          .setStyle(ButtonStyle.Success)
      );
      
    const row3 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('toggle_timestamp')
          .setLabel('⏱️ Timestamp')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('clear_fields')
          .setLabel('🗑️ Limpar Campos')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('manage_fields')
          .setLabel('📋 Gerenciar Campos')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('save_template')
          .setLabel('💾 Salvar Template')
          .setStyle(ButtonStyle.Success)
      );
      
    const row4 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('select_channel')
          .setLabel('📢 Selecionar Canal')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('setup_webhook')
          .setLabel('🔗 Configurar Webhook')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('preview')
          .setLabel('👁️ Prévia')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('send_embed')
          .setLabel('📤 Enviar Embed')
          .setStyle(ButtonStyle.Success)
      );
      
    return [row1, row2, row3, row4];
  }
  
  // Atualizar a prévia do embed
  async function updateEmbedPreview(client, interaction, session) {
    const embed = createEmbed(session.embedData);
    const components = createEmbedControlButtons();
    
    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({ 
          embeds: [embed], 
          components 
        });
      } else {
        // Atualizar a mensagem original com a prévia atualizada
        const channel = await client.channels.fetch(session.channelId);
        const message = await channel.messages.fetch(session.messageId);
        await message.edit({ 
          embeds: [embed], 
          components 
        });
        
        // Confirmar a ação do usuário
        await interaction.reply({ 
          content: 'Embed atualizado!', 
          ephemeral: true 
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar prévia:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          content: 'Houve um erro ao atualizar a prévia do embed.', 
          ephemeral: true 
        });
      }
    }
  }
  
  // Iniciar uma nova sessão de edição de embed
  async function startEmbedSession(client, interaction, templateName = null) {
    const { templateManager } = require('./index');
    
    let embedData = {
      title: 'Título do Embed',
      description: 'Descrição do seu embed aqui. Edite usando os botões abaixo!',
      color: '#0099ff',
      fields: [],
      timestamp: false
    };
    
    // Se for fornecido um template, use seus dados
    if (templateName) {
      const templates = templateManager.loadGuildTemplates(interaction.guildId);
      if (templates.has(templateName)) {
        embedData = { ...templates.get(templateName) };
        if (!embedData.fields) embedData.fields = [];
      }
    }
    
    const embed = createEmbed(embedData);
    const components = createEmbedControlButtons();
    
    // Enviar a mensagem de prévia do embed
    const reply = await interaction.reply({ 
      content: '**🔧 Painel de Edição de Embed**\nUse os botões abaixo para personalizar seu embed. A prévia será atualizada em tempo real!',
      embeds: [embed],
      components,
      fetchReply: true
    });
    
    // Salvar a sessão
    client.activeSessions.set(interaction.user.id, {
      messageId: reply.id,
      channelId: interaction.channelId,
      guildId: interaction.guildId,
      embedData,
      // Configurações de destino (padrão para o canal atual)
      destination: {
        type: 'channel',
        channelId: interaction.channelId,
        webhookUrl: null
      }
    });
    
    // Configurar coletor de interações para lidar com cliques nos botões
    const { setupButtonCollector } = require('../utils/buttonCollectors');
    setupButtonCollector(client, reply, interaction.user.id);
    
    return reply;
  }
  
  module.exports = {
    createEmbedControlButtons,
    updateEmbedPreview,
    startEmbedSession
  };
  