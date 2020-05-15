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
const pubdev_1 = require("./pubdev");
const log_1 = require("./log");
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
        log_1.log(`[COMMAND] FlutterFactOfTheDay`);
        if (arg === '')
            facts_1.getRandomFact(channel, sendFactLine);
        // TODO: implement a "direct" fact caller which reads a direct fact.
    }
    if (command.toLowerCase() === '!pubdev') {
        log_1.log(`[COMMAND] pubdev: ${arg}`);
        // Checks if there is an argument and if its somewhat valid
        if (arg === '' || !arg.match(/^\w+$/)) {
            client
                .say(channel, `${tags.username}, please provide a valid package name to search for. NotLikeThis`)
                .catch((err) => console.error);
            return;
        }
        const search = arg.trim().toLowerCase();
        // Call API
        pubdev_1.getPubDevPackageInfo(channel, tags, search, sendPubDevInfo);
    }
});
/**
 * Sends a preformatted message to a channel
 * @param channel channel to send message to.
 * @param line Text to be inserted into message.
 */
const sendFactLine = (channel, line) => {
    client
        .say(channel, `Flutter fact of the day: ${line} #ffotd`)
        .catch(console.error);
}; // Have to be done with a callback this way as fs.read is async
/**
 * Sends a preformatted message to a channel
 * @param channel channel to send message to.
 * @param response Pub dev api response.
 */
const sendPubDevInfo = (channel, tags, response) => {
    if (response === null) {
        client.say(channel, 'Package info not found');
        return;
    }
    client
        .say(channel, `${tags.username}: 📦 name: "${response.latest.pubspec.name}" 📦 description: "${response.latest.pubspec.description}" 📦 pub.dev: https://pub.dev/packages/${response.latest.pubspec.name}`)
        .catch((err) => console.error);
}; // Have to be done with a callback this way as async is stupid
client.on('connected', (address, port) => {
    log_1.log(`[CONNECT] Bot connected on: ${address}:${port}`);
});
client.on('join', (channel, username, self) => {
    if (self)
        log_1.log(`[CHANNEL] Bot joining: ${channel}`);
});
