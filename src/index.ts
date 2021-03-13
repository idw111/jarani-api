import '@babel/polyfill';
import http from 'http';
import Debug from 'debug';
import app from './app';
// import { connect as connectMysql } from './database';
import { connect as connectMongo } from './mongodb';

const run = async () => {
	// connectMysql();
	await connectMongo();

	const debug = Debug('template-project:server');

	const server = http.createServer(app);

	server.on('error', (err: NodeJS.ErrnoException) => {
		if (err.syscall !== 'listen') throw err;
		console.error(err.message);
		process.exit(1);
	});
	server.on('listening', () => {
		const address = server.address();
		const bind = typeof address === 'string' ? `pipe ${address}` : `port ${address?.port}`;
		debug(`listening on ${bind}`);
	});

	server.listen(process.env.SERVER_PORT);

	console.log('- http server started...');
};

try {
	run();
} catch (err) {
	console.error(err);
}
