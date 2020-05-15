import * as tmi from 'tmi.js';
import { getRandomFact } from './facts';

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
		if (arg == '') getRandomFact(channel, sendFactLine);
		// TODO: implement a "direct" fact caller which reads a direct fact.
		// TODO: Implement a pubdev search function
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
