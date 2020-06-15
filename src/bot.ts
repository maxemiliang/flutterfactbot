import * as tmi from 'tmi.js';
import { getRandomFact } from './facts';
import { AxiosResponse } from 'axios';
import { getPubDevPackageInfo } from './pubdev';
import { log } from './log';
import { getNpmPackageInfo } from './npm';

// Initalizes the twitch bot client
const client = tmi.Client({
	options: {
		debug: process.env.NODE_ENV === 'production' ? false : true,
	},
	connection: {
		reconnect: true,
		secure: true,
	},
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_OAUTH,
	},
	channels: ['rushkib', 'pixelogicdev'], // Channels that the bot should monitor.
});

// Connect to twitch and the channels
client.connect();

// Start monitoring messages
client.on('message', (channel, tags, message, self) => {
	if (self) return; // Dont do anything with your own messages
	const command = message.trim().split(' ')[0].toLowerCase(); // Nice solution: Kappa
	let arg = message.trim().split(' ').length > 1 ? message.split(' ')[1] : ''; // Even nicer solution, not error prone Kappa
	arg = arg.trim().toLowerCase(); // Nice and safe command handling
	switch (command) {
		case '!ffotd':
			log(`[COMMAND] name: ffotd; arguments: ${arg}`); // Why did i make my own log solution, because i can of course
			if (arg === '') getRandomFact(channel, sendFactLine); // TODO: Implement a direct fact caller
			break;
		case '!pubdev':
			log(`[COMMAND] name: pubdev; arguments: ${arg}`);
			// Checks if there is an argument and if its somewhat valid
			if (arg === '' || !arg.match(/^\w+$/)) {
				client
					.say(
						channel,
						`${tags.username}, please provide a valid package name to search for. NotLikeThis`
					)
					.catch((err) => console.error(err)); // clean error handling Pog
				return;
			}
			getPubDevPackageInfo(channel, tags, arg, sendPubDevInfo); // Call the pub.dev api and insert callback here when its done
			break;
		case '!npm':
			if (arg === '' || !arg.match(/^[a-zA-Z0-9-_]+$/)) {
				client
					.say(
						channel,
						`${tags.username}, please provide a valid package name to search for. NotLikeThis`
					)
					.catch((err) => console.error(err)); // clean error handling Pog
				return;
			}
			getNpmPackageInfo(channel, tags, arg, sendNpmInfo);
			break;
		case '!addfact':
			// for later if (arg !== '') handleFactAdd(channel, tags, client, message); // We pass the message as this might require some more argument handling
			break;
		case '!rntradgedy':
			client
				.say(
					channel,
					'Did you ever hear the tragedy of React Native? I thought not. It’s not a story the Facebook devs would tell you. It’s a Google legend. React Native was a "Native" mobile framework, so buggy and so slow it could only use the webview… It had such a knowledge of the JSX and Redux that it could even keep the 3 whole objects in store. Unfortunately, it thaught Flutter everything it knew, then Flutter killed him in his sleep. Ironic. He could save others from death, but not itself'
				)
				.catch((err) => console.error(err));
			break;
		case '!maketheswitch':
			client
				.say(
					channel,
					'Thinking about making the switch, JUST DO IT: https://flutter.dev/docs/get-started/flutter-for/react-native-devs'
				)
				.catch((err) => console.error(err));
			break;
		default:
			if (command.indexOf('!') > -1)
				log(`[COMMAND] command not found: ${command}`);
			break;
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
		// Error handling stuff
		client.say(channel, `${tags.username}: Package info not found FeelsBadMan`);
		return;
	}
	client
		.say(
			channel,
			`${tags.username}: [PUBDEV] 📦 name: "${response.latest.pubspec.name}" 📦 description: "${response.latest.pubspec.description}" 📦 pubdev: https://pub.dev/packages/${response.latest.pubspec.name}`
		)
		.catch((err) => console.error(err));
}; // Have to be done with a callback this way as async is stupid

/**
 * Sends a preformatted message to a channel
 * @param channel channel to send message to.
 * @param response Pub dev api response.
 */
const sendNpmInfo = (
	channel: string,
	tags: tmi.ChatUserstate,
	response: any
) => {
	if (response === null) {
		// Error handling stuff
		client.say(channel, `${tags.username}: Package info not found FeelsBadMan`);
		return;
	}
	client
		.say(
			channel,
			`${tags.username}: [NPM] 📦 name: "${response.collected.metadata.name}" 📦 description: "${response.collected.metadata.description}" 📦 NPM: ${response.collected.metadata.links.npm}`
		)
		.catch((err) => console.error(err));
}; // Have to be done with a callback this way as async is stupid

client.on('connected', (address, port) => {
	log(`[CONNECT] Bot connected on: ${address}:${port}`); // More nice logging
});

client.on('join', (channel, username, self) => {
	if (self) log(`[CHANNEL] Bot joining: ${channel}`); // Even more nice logging
});
