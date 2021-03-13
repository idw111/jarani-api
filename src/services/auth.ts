import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';

interface UserPayload {
	id: number;
	email: string;
	level?: number;
}

export const generatePayload = (user: UserPayload | null = null): UserPayload | null => (user ? { id: user.id, email: user.email, level: user.level ?? 0 } : null);

export const generateToken = async (admin: UserPayload | null = null): Promise<string> => {
	try {
		const token = await encodeJwt(generatePayload(admin));
		return token;
	} catch (err) {
		return '';
	}
};

export const encodeJwt = (json: UserPayload | null, expiresIn = '4h'): Promise<string> => {
	if (!json) throw new Error('invalid user payload');
	return new Promise((resolve, reject) => {
		jwt.sign(json, <string>process.env.JWT_SECRET, { expiresIn, issuer: process.env.JWT_ISSUER }, (err, token) => (err ? reject(err) : resolve(token as string)));
	});
};

export const verifyJwt = (token: string): {} => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, <string>process.env.JWT_SECRET, (err, decodedToken) => (err ? reject(err) : resolve(decodedToken)));
	});
};

export const parseJwt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const token = req.headers?.authorization?.replace(/^bearer\s/i, '');
	if (!token) return next();
	try {
		res.locals.user = await verifyJwt(token);
	} catch (err) {
		res.locals.user = null;
	}
	return next();
};

export const validatePassword = async (password: string, hashed: string): Promise<boolean> => {
	const valid = await bcrypt.compare(password, hashed);
	return valid;
};

export const hashPassword = async (password: string): Promise<string> => {
	const hashed = await bcrypt.hash(password, 10);
	return hashed;
};
