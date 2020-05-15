export const log = (msg: string) => {
	if (process.env.NODE_ENV !== 'production') return console.debug(msg);
	console.log(msg);
};
