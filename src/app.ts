import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

const app: express.Application = express();
const env: string = process.env.NODE_ENV || 'development';

// security measures
app.use(helmet({}));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(
	cors({
		origin: [
			<string>process.env.CLIENT_URL,
			// extra origins
			/localhost/,
		],
		credentials: true,
	})
);

app.set('trust proxy', 1);

// router
import router from './routes/router';
import { handleNotFound, handleRender } from './routes/error';
app.use('/', router);
app.use(handleNotFound);
app.use(handleRender);

export default app;
