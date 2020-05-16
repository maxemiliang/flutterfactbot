/**
 * Fancy log wrapper, really unnecessary
 * @param msg Simply the message to log
 */
export const log = (msg: string) => {
	if (process.env.NODE_ENV !== 'production') return console.debug(msg);
	console.log(msg);
};
