// events/guildCreate.js
const { Events } = require('discord.js');
const { sendAdminLog } = require('../modules/logSystem');

module.exports = {
  name: Events.GuildCreate,
  once: false,
  async execute(client, guild) {
    console.log(`Bot adicionado ao servidor: ${guild.name} (ID: ${guild.id})`);
    
    // Enviar log administrativo
    sendAdminLog({
      title: 'Bot Adicionado a um Servidor',
      description: 'O bot foi adicionado a um novo servidor!',
      color: '#43B581',
      fields: [
        { name: 'Servidor', value: guild.name },
        { name: 'ID do Servidor', value: guild.id },
        { name: 'Membros', value: guild.memberCount.toString() },
        { name: 'Dono', value: `<@${guild.ownerId}>` },
        { name: 'Criado em', value: new Date(guild.createdTimestamp).toLocaleString('pt-BR') }
      ],
      thumbnail: guild.iconURL({ dynamic: true })
    });
  },
};
