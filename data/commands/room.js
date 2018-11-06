module.exports = {
    name: 'room',
    cooldown: 10,
    description: "Move the bot to another room.",
    usage: "[room name]",
    admin: true,
    async execute(client, message, args) {
        let oldRoom = client.room;
        await client.sendChat(`Navigating to the ${args[0]} room...`);
        await client.setRoom(args[0]);
        client.sendChat(`I have moved from the '${oldRoom}' channel to this channel.`);
    }
}