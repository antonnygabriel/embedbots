// events/ready.js
const { Events, ActivityType } = require('discord.js');
const { loadGuildTemplates } = require('../modules/templateManager');

const statusList = [
  { name: 'bot feito por tonydoxv', type: ActivityType.Watching },
  { name: 'ajudando nas suas embeds 💬', type: ActivityType.Playing },
  { name: 'organizando seu servidor 🔧', type: ActivityType.Listening },
  { name: 'automatizando tudo ⚙️', type: ActivityType.Watching },
  { name: '/embed para começar 🚀', type: ActivityType.Playing }
];

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Bot online como ${client.user.tag} | Shard ${client.shard?.ids[0] || 0}`);
    
    // Configurar status rotativo
    let i = 0;
    setInterval(() => {
      const status = statusList[i];
      client.user.setActivity(status.name, { type: status.type });
      i = (i + 1) % statusList.length;
    }, 10000);
    
    // Registrar comandos slash
    const commands = [
      {
        name: 'embed',
        description: 'Abre o painel de criação de embed interativo',
      },
      {
        name: 'usar_template',
        description: 'Usa um template de embed salvo',
        options: [
          {
            name: 'nome',
            description: 'Nome do template',
            type: 3, // STRING
            required: true,
          },
        ],
      },
      {
        name: 'listar_templates',
        description: 'Lista todos os templates de embed disponíveis',
      },
      {
        name: 'excluir_template',
        description: 'Exclui um template de embed',
        options: [
          {
            name: 'nome',
            description: 'Nome do template a ser excluído',
            type: 3, // STRING
            required: true,
          },
        ],
      },
      {
        name: 'configurar_logs_servidor',
        description: 'Configura um canal para receber logs do servidor',
      },
      {
        name: 'configurar_logs',
        description: 'Configura o sistema de logs administrativos (apenas para o dono do bot)',
      },
      {
        name: 'estatisticas',
        description: 'Mostra estatísticas do bot',
      },
    ];

    client.application.commands.set(commands);
  },
};
