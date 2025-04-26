// utils/createEmbed.js
const { EmbedBuilder } = require('discord.js');

function createEmbed(options) {
  const embed = new EmbedBuilder();
  
  if (options.title) embed.setTitle(options.title);
  if (options.description) embed.setDescription(options.description);
  if (options.color) embed.setColor(options.color || '#0099ff');
  if (options.image) embed.setImage(options.image);
  if (options.thumbnail) embed.setThumbnail(options.thumbnail);
  if (options.author && options.author.name) {
    const authorOptions = { name: options.author.name };
    if (options.author.iconURL) authorOptions.iconURL = options.author.iconURL;
    if (options.author.url) authorOptions.url = options.author.url;
    embed.setAuthor(authorOptions);
  }
  if (options.footer && options.footer.text) {
    const footerOptions = { text: options.footer.text };
    if (options.footer.iconURL) footerOptions.iconURL = options.footer.iconURL;
    embed.setFooter(footerOptions);
  }
  if (options.timestamp) embed.setTimestamp();
  
  // Adicionar campos se existirem
  if (options.fields && Array.isArray(options.fields)) {
    options.fields.forEach(field => {
      if (field.name && field.value) {
        embed.addFields({ 
          name: field.name, 
          value: field.value, 
          inline: field.inline || false 
        });
      }
    });
  }
  
  return embed;
}

module.exports = createEmbed;
