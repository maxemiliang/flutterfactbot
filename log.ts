export const log = (msg: string) => {
	if (process.env.NODE_ENV !== 'production') return;
	console.log(msg);
};
