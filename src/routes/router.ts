import { Request, Response, Router } from 'express';
import { parseJwt } from '../services/auth';
// import { sequelize } from '../database';
import { handleAsync } from '../services';

const router = Router();

router.get('/favicon.ico', (req: Request, res: Response) => {
	return res.status(204).end();
});

router.get(
	'/status',
	handleAsync(async (req: Request, res: Response) => {
		// await sequelize.authenticate();
		return res.send('OK');
	})
);

router.use(parseJwt);

export default router;
