// events/templateSaved.js
const { Events } = require('discord.js');
const { sendAdminLog } = require('../modules/logSystem');

module.exports = {
  name: 'templateSaved',
  once: false,
  async execute(client, guildId, templateName, userId) {
    try {
      const guild = await client.guilds.fetch(guildId);
      const user = await client.users.fetch(userId);
      
      // Enviar log administrativo
      sendAdminLog({
        title: 'Template Salvo',
        description: `Um template de embed foi salvo em um servidor`,
        color: '#5865F2',
        fields: [
          { name: 'Servidor', value: guild.name },
          { name: 'ID do Servidor', value: guild.id },
          { name: 'Nome do Template', value: templateName },
          { name: 'Salvo por', value: user.tag }
        ],
        thumbnail: guild.iconURL({ dynamic: true })
      });
    } catch (error) {
      console.error('Erro ao processar evento templateSaved:', error);
    }
  },
};
