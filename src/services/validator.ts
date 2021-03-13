import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { throwError, handleAsync } from '.';

const verify = (req: Request, res: Response, next: NextFunction): void => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return throwError(errors.array()[0].msg, 500);
		return next();
	} catch (err) {
		return next(err);
	}
};

export const validate = (validations: Array<any>) => [validations, verify];

export const validateRequired = (fields: Array<string> | string, message: string) => validate([check(fields, message).exists({ checkFalsy: true })]);

export const validateNumeric = (fields: Array<string> | string, message: string) => validate([check(fields, message).exists({ checkFalsy: true }).isInt().toInt(10)]);

export const validateAuth = handleAsync(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		if (!res.locals.user) return throwError('not authenticated', 401);
		return next();
	}
);
