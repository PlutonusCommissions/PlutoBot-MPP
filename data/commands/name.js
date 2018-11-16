module.exports = {
    name: 'name',
    cooldown: 10,
    description: "Sets the bot's name.",
    usage: "[name]",
    admin: true,
    execute(client, message, args) {
        let name = args.join();
        client.setName(name);
        client.sendChat(`The bot's name has been set to '${name}'.`);
    }
}