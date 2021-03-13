import { NextFunction, Request, Response } from 'express';
// import { disconnect } from '../database';

const Slack = {
	write: (message: string, channelId: string) => null,
};

export class HttpError extends Error {
	public status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

export const handleNotFound = (req: Request, res: Response, next: NextFunction): void => {
	const error = new HttpError('Not found', 404);
	return next(error);
};

export const report = async (err: HttpError, req: Request, res: Response, next: NextFunction): Promise<void> => {
	const messages = [`*${err.message}*`, `_${req.method} ${req.originalUrl}_`, req.hostname];
	await Slack.write(messages.join('\n'), 'channelId');
	return next(err);
};

export const handleRender = (err: HttpError, req: Request, res: Response, next: NextFunction): any => {
	return res.status(err.status ?? 500).send(err.message);
};

export const handleUncaught = (exitCode: number): Function => async (err: Error): Promise<void> => {
	console.error(err);
	// await disconnect();
	return process.exit(exitCode);
};
