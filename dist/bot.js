"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tmi = __importStar(require("tmi.js"));
const facts_1 = require("./facts");
const client = tmi.Client({
    options: {
        debug: process.env.NODE_ENV == 'production' ? false : true,
    },
    connection: {
        reconnect: true,
        secure: true,
    },
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_OAUTH,
    },
    channels: ['rushkib', 'pixelogicdev'],
});
client.connect();
client.on('message', (channel, tags, message, self) => {
    if (self)
        return;
    const command = message.trim().split(' ')[0];
    const arg = message.trim().split(' ').length > 1 ? message.split(' ')[1] : '';
    if (command.toLowerCase() === '!ffotd') {
        if (arg == '')
            facts_1.getRandomFact(channel, sendMessage);
        // TODO: implement a "direct" fact caller which reads a direct fact.
    }
});
const sendMessage = (channel, line) => {
    client
        .say(channel, `Flutter fact of the day: ${line} #ffotd`)
        .catch(console.error);
};
