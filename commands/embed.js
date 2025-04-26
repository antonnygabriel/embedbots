// commands/embed.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { startEmbedSession } = require('../modules/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Abre o painel de criação de embed interativo'),
  
  async execute(client, interaction) {
    await startEmbedSession(client, interaction);
  },
};
