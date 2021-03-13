import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../routes/error';

interface PagingQuery {
	page?: string;
	limit?: string;
}

interface PagingResult {
	page: number;
	offset: number;
	limit: number;
}

export const handleAsync = (routerFn: Function) => (req: Request, res: Response, next: NextFunction) => routerFn(req, res, next).catch(next);

export const throwError = (message: string, status: number = 500): never => {
	const error = new HttpError(message, status);
	throw error;
};

export const url = (path: string): string => `${process.env.SERVER_URL}${path}`;

export const clientUrl = (path: string): string => `${process.env.CLIENT_URL}${path}`;

export const getPaging = (query: PagingQuery = {}, defaultLimit: number = 10): PagingResult => {
	const page = parseInt(query.page ?? '1', 10);
	const limit = query.limit ? parseInt(query.limit, 10) : defaultLimit;
	const offset = (page - 1) * limit;
	return { page, offset, limit };
};
