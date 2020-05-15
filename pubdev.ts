import axios, { AxiosResponse } from 'axios';

export const getPubDevPackageInfo = (
	channel: string,
	search: string,
	callback: (channel: string, resp: AxiosResponse | null) => void
) => {
	axios
		.get(`https://pub.dartlang.org/api/packages/${search}`, {
			headers: { 'User-Agent': 'PubDev-Twitch-Search-Bot v0.1.0' },
		})
		.then((res) => {
			callback(channel, res);
		})
		.catch((err) => {
			console.error(err);
			callback(channel, null);
		});
};
