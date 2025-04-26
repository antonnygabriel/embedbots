// commands/estatisticas.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('estatisticas')
    .setDescription('Mostra estatísticas do bot'),
  
  async execute(client, interaction) {
    // Calcular tempo de atividade
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime / 3600) % 24;
    const minutes = Math.floor(uptime / 60) % 60;
    const seconds = Math.floor(uptime % 60);
    
    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    
    // Obter estatísticas do sistema
    const memoryUsage = process.memoryUsage();
    const memoryUsedMB = Math.round(memoryUsage.rss / 1024 / 1024);
    const memoryTotalMB = Math.round(os.totalmem() / 1024 / 1024);
    const memoryPercent = ((memoryUsage.rss / os.totalmem()) * 100).toFixed(2);
    
    // Obter estatísticas do bot
    const guildCount = client.guilds.cache.size;
    const userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const channelCount = client.channels.cache.size;
    
    // Obter informações de shards
    const shardInfo = client.shard ? {
      id: client.shard.ids[0],
      count: client.shard.count
    } : null;
    
    // Criar embed
    const embed = new EmbedBuilder()
      .setTitle('📊 Estatísticas do Bot')
      .setColor('#0099ff')
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '⏱️ Tempo Online', value: uptimeString, inline: true },
        { name: '🖥️ Servidores', value: guildCount.toString(), inline: true },
        { name: '👥 Usuários', value: userCount.toString(), inline: true },
        { name: '💬 Canais', value: channelCount.toString(), inline: true },
        { name: '🧠 Uso de Memória', value: `${memoryUsedMB}MB / ${memoryTotalMB}MB (${memoryPercent}%)`, inline: true },
        { name: '🤖 Versão do Bot', value: process.env.npm_package_version || '1.0.0', inline: true }
      )
      .setFooter({ text: `Discord.js v${require('discord.js').version} | Node ${process.version}` })
      .setTimestamp();
    
    // Adicionar informações de shards se disponíveis
    if (shardInfo) {
      embed.addFields(
        { name: '🔹 Shard ID', value: shardInfo.id.toString(), inline: true },
        { name: '🔸 Total de Shards', value: shardInfo.count.toString(), inline: true }
      );
    }
    
    await interaction.reply({ embeds: [embed] });
  },
};
