/*
    PlutoBot.js
    (C) 2018 Plutonus
*/

const WebSocket = require("ws");
const EventEmitter = require('events');
const { Events } = require("./util/Constants");

class Client extends EventEmitter {
    constructor() {
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

        this.uri = "ws://www.multiplayerpiano.com";
        this.ws = undefined;
        this.connected = false;
        this.heartbeat = undefined;
        this.noteFlushInterval = undefined;
        this.serverTimeOffset = 0;
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

        this.ws.addEventListener("open", () => {
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
            this.sendArray([{ m: "ch", _id: "test/PlutoDev", set: undefined }]);
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

    send(raw) {
        if (this.connected) this.ws.send(raw);
    }

    sendArray(arr) {
        this.send(JSON.stringify(arr));
    }

    sendChat(msg) {
        this.sendArray([{
            m: "a",
            message: msg
        }]);
    }
}

module.exports = {
    Client: Client
}