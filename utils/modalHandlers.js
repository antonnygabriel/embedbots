// utils/modalHandlers.js
const { 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ActionRowBuilder,
    ComponentType,
    ChannelType,
    StringSelectMenuBuilder
  } = require('discord.js');
  
  const createEmbed = require('./createEmbed');
  const { updateEmbedPreview } = require('../modules/embedBuilder');
  const { saveGuildTemplate } = require('../modules/templateManager');
  const { sendGuildLog, sendAdminLog } = require('../modules/logSystem');
  const { sendWebhookMessage } = require('../modules/webhookManager');
  
  const modalHandlers = {
    // Modal para editar título
    showTitleModal: function(client, interaction, session) {
      const modal = new ModalBuilder()
        .setCustomId('title_modal')
        .setTitle('Editar Título');
      
      const titleInput = new TextInputBuilder()
        .setCustomId('title_input')
        .setLabel('Título do Embed')
        .setStyle(TextInputStyle.Short)
        .setValue(session.embedData.title || '')
        .setMaxLength(256)
        .setRequired(false);
      
      const actionRow = new ActionRowBuilder().addComponents(titleInput);
      modal.addComponents(actionRow);
      
      interaction.showModal(modal);
      
      const filter = i => i.customId === 'title_modal' && i.user.id === interaction.user.id;
      interaction.awaitModalSubmit({ filter, time: 120000 })
        .then(async modalInteraction => {
          const title = modalInteraction.fields.getTextInputValue('title_input');
          session.embedData.title = title;
          await updateEmbedPreview(client, modalInteraction, session);
        })
        .catch(error => {
          if (error.code !== 'InteractionCollectorError') {
            console.error('Erro ao processar modal de título:', error);
          }
        });
    },
  
    // Modal para editar descrição
    showDescriptionModal: function(client, interaction, session) {
      const modal = new ModalBuilder()
        .setCustomId('description_modal')
        .setTitle('Editar Descrição');
      
      const descriptionInput = new TextInputBuilder()
        .setCustomId('description_input')
        .setLabel('Descrição do Embed')
        .setStyle(TextInputStyle.Paragraph)
        .setValue(session.embedData.description || '')
        .setMaxLength(4000)
        .setRequired(false);
      
      const actionRow = new ActionRowBuilder().addComponents(descriptionInput);
      modal.addComponents(actionRow);
      
      interaction.showModal(modal);
      
      const filter = i => i.customId === 'description_modal' && i.user.id === interaction.user.id;
      interaction.awaitModalSubmit({ filter, time: 120000 })
        .then(async modalInteraction => {
          const description = modalInteraction.fields.getTextInputValue('description_input');
          session.embedData.description = description;
          await updateEmbedPreview(client, modalInteraction, session);
        })
        .catch(error => {
          if (error.code !== 'InteractionCollectorError') {
            console.error('Erro ao processar modal de descrição:', error);
          }
        });
    },
  
    // Modal para editar cor
    showColorModal: function(client, interaction, session) {
      const modal = new ModalBuilder()
        .setCustomId('color_modal')
        .setTitle('Editar Cor');
      
      const colorInput = new TextInputBuilder()
        .setCustomId('color_input')
        .setLabel('Cor (formato HEX: #FF0000 para vermelho)')
        .setStyle(TextInputStyle.Short)
        .setValue(session.embedData.color || '#0099ff')
        .setPlaceholder('#0099ff')
        .setRequired(false);
      
      const actionRow = new ActionRowBuilder().addComponents(colorInput);
      modal.addComponents(actionRow);
      
      interaction.showModal(modal);
      
      const filter = i => i.customId === 'color_modal' && i.user.id === interaction.user.id;
      interaction.awaitModalSubmit({ filter, time: 120000 })
        .then(async modalInteraction => {
          const color = modalInteraction.fields.getTextInputValue('color_input');
          session.embedData.color = color;
          await updateEmbedPreview(client, modalInteraction, session);
        })
        .catch(error => {
          if (error.code !== 'InteractionCollectorError') {
            console.error('Erro ao processar modal de cor:', error);
          }
        });
    },
  
    // Modal para editar imagem
    showImageModal: function(client, interaction, session) {
      const modal = new ModalBuilder()
        .setCustomId('image_modal')
        .setTitle('Editar Imagem');
      
      const imageInput = new TextInputBuilder()
        .setCustomId('image_input')
        .setLabel('URL da imagem')
        .setStyle(TextInputStyle.Short)
        .setValue(session.embedData.image || '')
        .setPlaceholder('https://exemplo.com/imagem.png')
        .setRequired(false);
      
      const actionRow = new ActionRowBuilder().addComponents(imageInput);
      modal.addComponents(actionRow);
      
      interaction.showModal(modal);
      
      const filter = i => i.customId === 'image_modal' && i.user.id === interaction.user.id;
      interaction.awaitModalSubmit({ filter, time: 120000 })
        .then(async modalInteraction => {
          const image = modalInteraction.fields.getTextInputValue('image_input');
          session.embedData.image = image.trim() || null;
          await updateEmbedPreview(client, modalInteraction, session);
        })
        .catch(error => {
          if (error.code !== 'InteractionCollectorError') {
            console.error('Erro ao processar modal de imagem:', error);
          }
        });
    },
  
    // Modal para editar thumbnail
    showThumbnailModal: function(client, interaction, session) {
      const modal = new ModalBuilder()
        .setCustomId('thumbnail_modal')
        .setTitle('Editar Thumbnail');
      
      const thumbnailInput = new TextInputBuilder()
        .setCustomId('thumbnail_input')
        .setLabel('URL da thumbnail')
        .setStyle(TextInputStyle.Short)
        .setValue(session.embedData.thumbnail || '')
        .setPlaceholder('https://exemplo.com/thumbnail.png')
        .setRequired(false);
      
      const actionRow = new ActionRowBuilder().addComponents(thumbnailInput);
      modal.addComponents(actionRow);
      
      interaction.showModal(modal);
      
      const filter = i => i.customId === 'thumbnail_modal' && i.user.id === interaction.user.id;
      interaction.awaitModalSubmit({ filter, time: 120000 })
        .then(async modalInteraction => {
          const thumbnail = modalInteraction.fields.getTextInputValue('thumbnail_input');
          session.embedData.thumbnail = thumbnail.trim() || null;
          await updateEmbedPreview(client, modalInteraction, session);
        })
        .catch(error => {
          if (error.code !== 'InteractionCollectorError') {
            console.error('Erro ao processar modal de thumbnail:', error);
          }
        });
    },
  
    // Modal para editar autor
    showAuthorModal: function(client, interaction, session) {
      const modal = new ModalBuilder()
        .setCustomId('author_modal')
        .setTitle('Editar Autor');
      
      const authorNameInput = new TextInputBuilder()
        .setCustomId('author_name_input')
        .setLabel('Nome do autor')
        .setStyle(TextInputStyle.Short)
        .setValue(session.embedData.author?.name || '')
        .setRequired(false);
        
      const authorIconInput = new TextInputBuilder()
        .setCustomId('author_icon_input')
        .setLabel('URL do ícone do autor')
        .setStyle(TextInputStyle.Short)
        .setValue(session.embedData.author?.iconURL || '')
        .setRequired(false);
        
      const authorURLInput = new TextInputBuilder()
        .setCustomId('author_url_input')
        .setLabel('URL para o nome do autor (opcional)')
        .setStyle(TextInputStyle.Short)
        .setValue(session.embedData.author?.url || '')
        .setRequired(false);
      
      const row1 = new ActionRowBuilder().addComponents(authorNameInput);
      const row2 = new ActionRowBuilder().addComponents(authorIconInput);
      const row3 = new ActionRowBuilder().addComponents(authorURLInput);
      
      modal.addComponents(row1, row2, row3);
      
      interaction.showModal(modal);
      
      const filter = i => i.customId === 'author_modal' && i.user.id === interaction.user.id;
      interaction.awaitModalSubmit({ filter, time: 120000 })
        .then(async modalInteraction => {
          const authorName = modalInteraction.fields.getTextInputValue('author_name_input');
          const authorIcon = modalInteraction.fields.getTextInputValue('author_icon_input');
          const authorURL = modalInteraction.fields.getTextInputValue('author_url_input');
          
          if (authorName.trim()) {
            session.embedData.author = {
              name: authorName,
              iconURL: authorIcon.trim() || null,
              url: authorURL.trim() || null
            };
          } else {
            session.embedData.author = null;
          }
          
          await updateEmbedPreview(client, modalInteraction, session);
        })
        .catch(error => {
          if (error.code !== 'InteractionCollectorError') {
            console.error('Erro ao processar modal de autor:', error);
          }
        });
    },
  
    // Modal para editar rodapé
    showFooterModal: function(client, interaction, session) {
      const modal = new ModalBuilder()
        .setCustomId('footer_modal')
        .setTitle('Editar Rodapé');
      
      const footerTextInput = new TextInputBuilder()
        .setCustomId('footer_text_input')
        .setLabel('Texto do rodapé')
        .setStyle(TextInputStyle.Short)
        .setValue(session.embedData.footer?.text || '')
        .setRequired(false);
        
      const footerIconInput = new TextInputBuilder()
        .setCustomId('footer_icon_input')
        .setLabel('URL do ícone do rodapé')
        .setStyle(TextInputStyle.Short)
        .setValue(session.embedData.footer?.iconURL || '')
        .setRequired(false);
      
      const row1 = new ActionRowBuilder().addComponents(footerTextInput);
      const row2 = new ActionRowBuilder().addComponents(footerIconInput);
      
      modal.addComponents(row1, row2);
      
      interaction.showModal(modal);
      
      const filter = i => i.customId === 'footer_modal' && i.user.id === interaction.user.id;
      interaction.awaitModalSubmit({ filter, time: 120000 })
        .then(async modalInteraction => {
          const footerText = modalInteraction.fields.getTextInputValue('footer_text_input');
          const footerIcon = modalInteraction.fields.getTextInputValue('footer_icon_input');
          
          if (footerText.trim()) {
            session.embedData.footer = {
              text: footerText,
              iconURL: footerIcon.trim() || null
            };
          } else {
            session.embedData.footer = null;
          }
          
          await updateEmbedPreview(client, modalInteraction, session);
        })
        .catch(error => {
          if (error.code !== 'InteractionCollectorError') {
            console.error('Erro ao processar modal de rodapé:', error);
          }
        });
    },
  
    // Modal para adicionar campo
    showFieldModal: function(client, interaction, session) {
      const modal = new ModalBuilder()
        .setCustomId('field_modal')
        .setTitle('Adicionar Campo');
      
      const fieldNameInput = new TextInputBuilder()
        .setCustomId('field_name_input')
        .setLabel('Nome do campo')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
        
      const fieldValueInput = new TextInputBuilder()
        .setCustomId('field_value_input')
        .setLabel('Valor do campo')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);
        
      const fieldInlineInput = new TextInputBuilder()
        .setCustomId('field_inline_input')
        .setLabel('Inline? (true/false)')
        .setStyle(TextInputStyle.Short)
        .setValue('false')
        .setPlaceholder('Digite "true" para inline, "false" para bloco')
        .setRequired(false);
      
      const row1 = new ActionRowBuilder().addComponents(fieldNameInput);
      const row2 = new ActionRowBuilder().addComponents(fieldValueInput);
      const row3 = new ActionRowBuilder().addComponents(fieldInlineInput);
      
      modal.addComponents(row1, row2, row3);
      
      interaction.showModal(modal);
      
      const filter = i => i.customId === 'field_modal' && i.user.id === interaction.user.id;
      interaction.awaitModalSubmit({ filter, time: 120000 })
        .then(async modalInteraction => {
          const fieldName = modalInteraction.fields.getTextInputValue('field_name_input');
          const fieldValue = modalInteraction.fields.getTextInputValue('field_value_input');
          const fieldInline = modalInteraction.fields.getTextInputValue('field_inline_input').toLowerCase() === 'true';
          
          if (fieldName && fieldValue) {
            if (!session.embedData.fields) {
              session.embedData.fields = [];
            }
            
            session.embedData.fields.push({
              name: fieldName,
              value: fieldValue,
              inline: fieldInline
            });
          }
          
          await updateEmbedPreview(client, modalInteraction, session);
        })
        .catch(error => {
          if (error.code !== 'InteractionCollectorError') {
            console.error('Erro ao processar modal de campo:', error);
          }
        });
    },
  
    // Modal para salvar template
    showSaveTemplateModal: function(client, interaction, session) {
      const modal = new ModalBuilder()
        .setCustomId('save_template_modal')
        .setTitle('Salvar Template');
      
      const templateNameInput = new TextInputBuilder()
        .setCustomId('template_name_input')
        .setLabel('Nome do template')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('meu_template')
        .setRequired(true);
      
      const actionRow = new ActionRowBuilder().addComponents(templateNameInput);
      modal.addComponents(actionRow);
      
      interaction.showModal(modal);
      
      const filter = i => i.customId === 'save_template_modal' && i.user.id === interaction.user.id;
      interaction.awaitModalSubmit({ filter, time: 120000 })
        .then(async modalInteraction => {
          const templateName = modalInteraction.fields.getTextInputValue('template_name_input')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '_');
          
          if (templateName) {
            // Salvar o template
            saveGuildTemplate(session.guildId, templateName, session.embedData);
            
            await modalInteraction.reply({
              content: `✅ Template **${templateName}** salvo com sucesso!`,
              ephemeral: true
            });
            
            // Enviar log para o servidor
            sendGuildLog(session.guildId, {
              title: 'Template Salvo',
              description: `Um novo template de embed foi salvo!`,
              color: '#5865F2',
              fields: [
                { name: 'Nome do Template', value: templateName },
                { name: 'Salvo por', value: interaction.user.tag }
              ]
            });
            
            // Emitir evento para logs administrativos
            client.emit('templateSaved', session.guildId, templateName, interaction.user.id);
          } else {
            await modalInteraction.reply({
              content: '❌ Nome de template inválido!',
              ephemeral: true
            });
          }
        })
        .catch(error => {
          if (error.code !== 'InteractionCollectorError') {
            console.error('Erro ao processar modal de salvar template:', error);
          }
        });
    },
  
    // Modal para configurar webhook
    showWebhookModal: function(client, interaction, session) {
      const modal = new ModalBuilder()
        .setCustomId('webhook_modal')
        .setTitle('Configurar Webhook');
      
      const webhookUrlInput = new TextInputBuilder()
        .setCustomId('webhook_url_input')
        .setLabel('URL do Webhook')
        .setStyle(TextInputStyle.Paragraph)
        .setValue(session.destination?.webhookUrl || '')
        .setPlaceholder('https://discord.com/api/webhooks/...')
        .setRequired(true);
      
      const webhookNameInput = new TextInputBuilder()
        .setCustomId('webhook_name_input')
        .setLabel('Nome do Webhook (opcional)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Nome que aparecerá ao enviar')
        .setRequired(false);
      
      const webhookAvatarInput = new TextInputBuilder()
        .setCustomId('webhook_avatar_input')
        .setLabel('Avatar do Webhook (opcional)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('URL da imagem para avatar')
        .setRequired(false);
      
      const row1 = new ActionRowBuilder().addComponents(webhookUrlInput);
      const row2 = new ActionRowBuilder().addComponents(webhookNameInput);
      const row3 = new ActionRowBuilder().addComponents(webhookAvatarInput);
      
      modal.addComponents(row1, row2, row3);
      
      interaction.showModal(modal);
      
      const filter = i => i.customId === 'webhook_modal' && i.user.id === interaction.user.id;
      interaction.awaitModalSubmit({ filter, time: 120000 })
        .then(async modalInteraction => {
          const webhookUrl = modalInteraction.fields.getTextInputValue('webhook_url_input');
          const webhookName = modalInteraction.fields.getTextInputValue('webhook_name_input');
          const webhookAvatar = modalInteraction.fields.getTextInputValue('webhook_avatar_input');
          
          if (webhookUrl.trim()) {
            session.destination = {
              type: 'webhook',
              webhookUrl: webhookUrl.trim(),
              webhookName: webhookName.trim() || null,
              webhookAvatar: webhookAvatar.trim() || null
            };
            
            await modalInteraction.reply({
              content: '✅ Webhook configurado com sucesso! O embed será enviado para este webhook.',
              ephemeral: true
            });
          } else {
            await modalInteraction.reply({
              content: '❌ URL do webhook inválida. O webhook não foi configurado.',
              ephemeral: true
            });
          }
        })
        .catch(error => {
          if (error.code !== 'InteractionCollectorError') {
            console.error('Erro ao processar modal de webhook:', error);
          }
        });
    },
  
    // Seletor de canais
    showChannelSelector: async function(client, interaction, session) {
      try {
        // Obter os canais de texto do servidor
        const guild = interaction.guild;
        const textChannels = guild.channels.cache.filter(
          channel => channel.type === ChannelType.GuildText && 
          channel.permissionsFor(interaction.user).has('SendMessages')
        );
        
        if (textChannels.size === 0) {
          await interaction.reply({
            content: "Não foi possível encontrar canais de texto onde você tem permissão para enviar mensagens.",
            ephemeral: true
          });
          return;
        }
        
        // Criar menu de seleção com os canais disponíveis
        const channelSelect = new StringSelectMenuBuilder()
          .setCustomId('channel_select')
          .setPlaceholder('Selecione um canal para enviar o embed')
          .addOptions(
            textChannels.map(channel => ({
              label: channel.name,
              value: channel.id,
              description: `#${channel.name}`,
              default: channel.id === session.destination?.channelId
            }))
          );
        
        const row = new ActionRowBuilder().addComponents(channelSelect);
        
        await interaction.reply({
          content: 'Selecione o canal onde deseja enviar o embed:',
          components: [row],
          ephemeral: true
        });
        
        // Configurar coletor para a seleção de canal
        const filter = i => i.customId === 'channel_select' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          componentType: ComponentType.StringSelect,
          time: 60000,
          max: 1
        });
        
        collector.on('collect', async i => {
          const selectedChannelId = i.values[0];
          session.destination = {
            type: 'channel',
            channelId: selectedChannelId,
            webhookUrl: null
          };
          
          const channel = guild.channels.cache.get(selectedChannelId);
          await i.update({
            content: `Canal selecionado: #${channel.name}`,
            components: []
          });
        });
        
        collector.on('end', collected => {
          if (collected.size === 0) {
            interaction.editReply({
              content: 'Seleção de canal cancelada ou expirada.',
              components: []
            }).catch(console.error);
          }
        });
        
      } catch (error) {
        console.error('Erro ao mostrar seletor de canais:', error);
        await interaction.reply({
          content: 'Ocorreu um erro ao carregar os canais disponíveis.',
          ephemeral: true
        });
      }
    },
  
    // Enviar embed final
    sendFinalEmbed: async function(client, interaction, session) {
      const embed = createEmbed(session.embedData);
      
      try {
        // Verificar o tipo de destino (canal ou webhook)
        if (session.destination?.type === 'webhook' && session.destination.webhookUrl) {
          // Enviar para webhook
          const webhookOptions = {
            embeds: [embed],
            username: session.destination.webhookName || undefined,
            avatarURL: session.destination.webhookAvatar || undefined
          };
          
          const result = await sendWebhookMessage(session.destination.webhookUrl, webhookOptions);
          
          if (!result) {
            throw new Error('Falha ao enviar para webhook');
          }
          
          // Atualizar mensagem para indicar que o embed foi enviado
          await interaction.update({ 
            content: '**✅ Embed enviado com sucesso via webhook!**\nO painel de edição foi encerrado.',
            embeds: [],
            components: []
          });
          
          // Enviar log para o servidor
          sendGuildLog(session.guildId, {
            title: 'Embed Enviado',
            description: 'Um embed foi enviado via webhook',
            color: '#43B581',
            fields: [
              { name: 'Enviado por', value: interaction.user.tag }
            ]
          });
        } else {
          // Enviar para canal do Discord
          let targetChannelId = session.destination?.channelId || interaction.channelId;
          const targetChannel = await client.channels.fetch(targetChannelId);
          
          if (!targetChannel) {
            throw new Error('Canal de destino não encontrado');
          }
          
          await targetChannel.send({ embeds: [embed] });
          
          // Atualizar mensagem para indicar que o embed foi enviado
          await interaction.update({ 
            content: `**✅ Embed enviado com sucesso para #${targetChannel.name}!**\nO painel de edição foi encerrado.`,
            embeds: [],
            components: []
          });
          
          // Enviar log para o servidor
          sendGuildLog(session.guildId, {
            title: 'Embed Enviado',
            description: `Um embed foi enviado para #${targetChannel.name}`,
            color: '#43B581',
            fields: [
              { name: 'Enviado por', value: interaction.user.tag }
            ]
          });
        }
        
        // Remover a sessão
        client.activeSessions.delete(interaction.user.id);
      } catch (error) {
        console.error('Erro ao enviar embed final:', error);
        await interaction.reply({ 
          content: `Houve um erro ao enviar o embed: ${error.message}`, 
          ephemeral: true 
        });
      }
    }
  };
  
  module.exports = {
    modalHandlers
  };
  