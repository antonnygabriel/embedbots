// events/guildDelete.js
const { Events } = require('discord.js');
const { sendAdminLog } = require('../modules/logSystem');

module.exports = {
  name: Events.GuildDelete,
  once: false,
  async execute(client, guild) {
    console.log(`Bot removido do servidor: ${guild.name} (ID: ${guild.id})`);
    
    // Enviar log administrativo
    sendAdminLog({
      title: 'Bot Removido de um Servidor',
      description: 'O bot foi removido de um servidor.',
      color: '#F04747',
      fields: [
        { name: 'Servidor', value: guild.name },
        { name: 'ID do Servidor', value: guild.id },
        { name: 'Membros', value: guild.memberCount.toString() }
      ],
      thumbnail: guild.iconURL({ dynamic: true })
    });
  },
};
