module.exports = {
    name: 'room',
    cooldown: 10,
    description: "Move the bot to another room.",
    usage: "[room name]",
    admin: true,
    async execute(client, message, args) {
        let oldRoom = client.room;
        let newRoom = args[0].replace(/\%20/g, " ");
        await client.sendChat(`Navigating to the ${newRoom} room...`);
        client.setRoom(newRoom);
        setTimeout(() => client.sendChat(`I have moved from the '${oldRoom}' channel to this channel.`), 1000);
    }
}