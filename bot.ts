import * as tmi from 'tmi.js';
import { getRandomFact } from './facts';
import { AxiosResponse } from 'axios';
import { getPubDevPackageInfo } from './pubdev';

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
		if (arg === '') getRandomFact(channel, sendFactLine);
		// TODO: implement a "direct" fact caller which reads a direct fact.
	}
	if (command.toLowerCase() === '!pubdev') {
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
		getPubDevPackageInfo(channel, search, sendPubDevInfo);
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
const sendPubDevInfo = (channel: string, response: AxiosResponse | null) => {
	if (response === null || response.status !== 200) {
		client.say(channel, 'Package info not found');
		return;
	}
	const info = response.data;
	client
		.say(
			channel,
			`Package name: ${info.latest.pubspec.name}; Package description: "${info.latest.pubspec.description}"; Package homepage: https://pub.dev/packages/${info.latest.pubspec.name}`
		)
		.catch((err) => console.error);
}; // Have to be done with a callback this way as async is stupid
