// handlers/commandHandler.js
const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    // Definir o comando na coleção
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`Comando carregado: ${command.data.name}`);
    } else {
      console.log(`⚠️ O comando em ${filePath} está com a estrutura incorreta.`);
    }
  }
  
  console.log(`Carregados ${client.commands.size} comandos.`);
};
