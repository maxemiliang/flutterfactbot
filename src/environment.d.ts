declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TWITCH_OAUTH: string; // Bot oauth string, can be retrieved from: https://twitchapps.com/tmi/
			TWITCH_USERNAME: string; // Bot username
			GOD_EMPEROR: string; // Used for the admin of the bot
			NODE_ENV: 'development' | 'production'; // Self explanatory
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
