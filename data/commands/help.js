module.exports = {
    name: 'help',
    cooldown: 10,
    description: "Displays the bot's commands or info about a specific command.",
    usage: "[command]",
<<<<<<< HEAD
=======
    admin: false,
>>>>>>> master
    execute(client, message, args) {
        const { prefix } = require("../config.json");

        let data = undefined;
        const { commands } = client;
        
        if(args[0]==undefined) {
            data = "COMMANDS: " + commands.map(command => command.name).join(", ");
            client.sendChat(data);
            return client.sendChat("You can do ;help [command] to get info on a command.");
        }

        const name = args[0].toLowerCase();
<<<<<<< HEAD
        const command = commands.get(name) || commands.find(c);
=======
        const command = commands.get(name) || commands.find(name);
>>>>>>> master

        if(!command) {
            return client.sendChat(`'${name}' is not a valid command, ${msg.p.name}.`)
        }

        data = command.name;
        if(command.description) data = data + ` - ${command.description}`;
        if(command.usage) data = data + ` - ${prefix}${command.name} ${command.usage}`;

        return client.sendChat(data);
    }
};