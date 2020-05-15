import * as tmi from 'tmi.js';
import { getRandomFact } from './facts';
import { AxiosResponse } from 'axios';
import { getPubDevPackageInfo } from './pubdev';
import { log } from './log';

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
	if (self) return;
	const command = message.trim().split(' ')[0];
	const arg = message.trim().split(' ').length > 1 ? message.split(' ')[1] : '';
	if (command.toLowerCase() === '!ffotd') {
		log(`[COMMAND] FlutterFactOfTheDay`);
		if (arg === '') getRandomFact(channel, sendFactLine);
		// TODO: implement a "direct" fact caller which reads a direct fact.
	}
	if (command.toLowerCase() === '!pubdev') {
		log(`[COMMAND] pubdev: ${arg}`);
		// Checks if there is an argument and if its somewhat valid
		if (arg === '' || !arg.match(/^\w+$/)) {
			client
				.say(
					channel,
					`${tags.username}, please provide a valid package name to search for. NotLikeThis`
				)
				.catch((err) => console.error);
			return;
		}
		const search = arg.trim().toLowerCase();
		// Call API
		getPubDevPackageInfo(channel, tags, search, sendPubDevInfo);
	}
});

/**
 * Sends a preformatted message to a channel
 * @param channel channel to send message to.
 * @param line Text to be inserted into message.
 */
const sendFactLine = (channel: string, line: string) => {
	client
		.say(channel, `Flutter fact of the day: ${line} #ffotd`)
		.catch(console.error);
}; // Have to be done with a callback this way as fs.read is async

/**
 * Sends a preformatted message to a channel
 * @param channel channel to send message to.
 * @param response Pub dev api response.
 */
const sendPubDevInfo = (
	channel: string,
	tags: tmi.ChatUserstate,
	response: any
) => {
	if (response === null) {
		client.say(channel, 'Package info not found');
		return;
	}
	client
		.say(
			channel,
			`${tags.username}: 📦 name: "${response.latest.pubspec.name}" 📦 description: "${response.latest.pubspec.description}" 📦 pubdev: https://pub.dev/packages/${response.latest.pubspec.name}`
		)
		.catch((err) => console.error);
}; // Have to be done with a callback this way as async is stupid

client.on('connected', (address, port) => {
	log(`[CONNECT] Bot connected on: ${address}:${port}`);
});

client.on('join', (channel, username, self) => {
	if (self) log(`[CHANNEL] Bot joining: ${channel}`);
});
