// shardManager.js
const { ShardingManager } = require('discord.js');
const path = require('path');
require('dotenv').config();

const manager = new ShardingManager(path.join(__dirname, 'index.js'), {
  token: process.env.TOKEN,
  totalShards: 'auto',
  respawn: true
});

// Evento quando um shard é criado
manager.on('shardCreate', shard => {
  console.log(`Lançado shard ${shard.id}`);
  
  // Configurar listeners para eventos do shard
  shard.on('ready', () => {
    console.log(`Shard ${shard.id} conectado e pronto!`);
  });
  
  shard.on('disconnect', () => {
    console.log(`Shard ${shard.id} desconectado!`);
  });
  
  shard.on('reconnecting', () => {
    console.log(`Shard ${shard.id} reconectando...`);
  });
  
  shard.on('death', () => {
    console.error(`Shard ${shard.id} morreu! Tentando reiniciar...`);
  });
  
  shard.on('error', (error) => {
    console.error(`Erro no shard ${shard.id}:`, error);
  });
});

// Iniciar os shards
manager.spawn()
  .then(shards => {
    console.log(`${shards.size} shards inicializados com sucesso!`);
  })
  .catch(error => {
    console.error('Erro ao inicializar shards:', error);
  });

// Método para obter estatísticas dos shards
async function getShardStats() {
  try {
    // Obter contagem de servidores em todos os shards
    const guildCounts = await manager.fetchClientValues('guilds.cache.size');
    const totalGuilds = guildCounts.reduce((acc, count) => acc + count, 0);
    
    // Obter contagem de usuários em todos os shards
    const memberCounts = await manager.broadcastEval(client => 
      client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
    );
    const totalMembers = memberCounts.reduce((acc, count) => acc + count, 0);
    
    return {
      shards: guildCounts.length,
      guilds: totalGuilds,
      members: totalMembers
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas dos shards:', error);
    return null;
  }
}

// Exportar o gerenciador de shards para uso em outros módulos
module.exports = {
  manager,
  getShardStats
};
