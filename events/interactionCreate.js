// events/interactionCreate.js
const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(client, interaction) {
    // Lidar com comandos slash
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      
      if (!command) {
        console.error(`Comando ${interaction.commandName} não encontrado.`);
        return;
      }
      
      try {
        await command.execute(client, interaction);
      } catch (error) {
        console.error(`Erro ao executar o comando ${interaction.commandName}:`, error);
        
        const errorMessage = {
          content: 'Houve um erro ao executar este comando!',
          ephemeral: true
        };
        
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      }
    }
    
    // Lidar com interações de modal
    if (interaction.isModalSubmit()) {
      // Os modais são tratados em seus respectivos handlers
    }
    
    // Lidar com interações de menu de seleção
    if (interaction.isStringSelectMenu()) {
      // Os menus são tratados em seus respectivos handlers
    }
  },
};
