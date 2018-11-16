/*
    PlutoBot.js
    (C) 2018 Plutonus
*/

const WebSocket = require("ws");
const EventEmitter = require('events');
const { Events } = require("./util/Constants");
const config = require("../data/config.json");

console.log("Welcome to PlutoBot!\n");

class Client extends EventEmitter {
    constructor(options = {}) {
        super();

        this.userData = {
            displayName: "PlutoBot",
            id: undefined,
            _id: undefined,
            channel: undefined
        }
        this.notes = {
            noteBuffer: [],
            noteBufferTime: 0
        }
        this.stats = {
            readyAt: null
        }

        this.room = undefined;
        this.uri = "ws://www.multiplayerpiano.com";
        this.ws = undefined;
        this.connected = false;
        this.heartbeat = undefined;
        this.noteFlushInterval = undefined;
        this.serverTimeOffset = 0;

        this.options = options;
    }

    get uptime() {
        return this.stats.readyAt ? Date.now() - this.stats.readyAt : null;
    }


    // MAIN FUNCTIONS
    async start() {
        this.emit(Events.DEBUG, `Connecting...`);
        this.ws = new WebSocket(this.uri, {
			origin: "http://www.multiplayerpiano.com"
		});
        var self = this;

        this.ws.addEventListener("close", () => {
            clearInterval(self.heartbeat);
            clearInterval(self.noteFlushInterval);
            self.emit(Events.DEBUG, `Connection to MultiplayerPiano was lost.`)
        });

        this.ws.addEventListener("open", async () => {
            self.stats.readyAt = Date.now();
            self.connected = true;

            self.sendArray([{ m: "hi" }]);
            self.heartbeat = setInterval(() => {
                self.sendArray([{ m: "t", e: Date.now() }]);
            }, 20000);

            self.notes.noteBuffer = [];
            self.notes.noteBufferTime = 0;
            self.notes.noteFlushInterval = setInterval(() => {
                if (self.notes.noteBufferTime && self.notes.noteBuffer.length > 0) {
                    self.sendArray([{ m: "n", t: self.notes.noteBufferTime + self.serverTimeOffset, n: self.notes.noteBuffer }]);
                    self.notes.noteBufferTime = 0;
                    self.notes.noteBuffer = [];
                }
            }, 200);

            self.emit(Events.DEBUG, `Connected!`);
            await self.setRoom(self.options.room || "lobby");
            self.sendChat("Ready!");
            self.emit(Events.READY);
        });
        this.ws.addEventListener("message", function(evt) {
            var transmission = JSON.parse(evt.data);
            for(var i = 0; i < transmission.length; i++) {
                var msg = transmission[i];
                if(msg.m=="a") self.emit(Events.MESSAGE_CREATE, msg);
            }
        });
    }

    stop() {

    }

    async send(raw) {
        if (this.connected) await this.ws.send(raw);
    }

    async sendArray(arr) {
        await this.send(JSON.stringify(arr));
    }

    async sendChat(msg) {
        await this.sendArray([{
            m: "a",
            message: `[${this.userData.displayName}]: ${msg}`
        }]);
    }

    setRoom(id) {
        this.sendArray([{ m: "ch", _id: id, set: undefined }]);
        this.room = id;
    }
}

module.exports = {
    Client: Client
}