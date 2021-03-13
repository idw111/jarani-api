import fs from 'fs';
import path from 'path';
import { Sequelize, DataType, Options, ModelAttributeColumnOptions, Model } from 'sequelize';

interface DatabaseConfig {
	username: string;
	password: string;
	database: string;
}

interface Models {
	[key: string]: any;
}

interface FieldOptions {
	defaultValue?: any;
}

const config: DatabaseConfig = {
	username: <string>process.env.MYSQL_USERNAME,
	password: <string>process.env.MYSQL_PASSWORD,
	database: <string>process.env.MYSQL_DATABASE,
};

const options: Options = {
	host: <string>process.env.MYSQL_HOST,
	port: parseInt(<string>process.env.MYSQL_PORT, 10),
	timezone: '+09:00',
	dialect: 'mysql',
};

export const sequelize = new Sequelize(config.database, config.username, config.password, options);

export const transaction = sequelize.transaction.bind(sequelize);

export const disconnect = async (): Promise<void> => sequelize.close();

const associates: Array<Function> = [];

const importDirectory = (directory: string): void => {
	fs.readdirSync(directory)
		.filter((file) => file.endsWith('.js'))
		.forEach((file) => importFile(path.join(directory, file)));
};

const importFile = (filepath: string): void => {
	const { defineModel, associate } = require(`./${filepath}`).default;
	if (associate) associates.push(associate);
	defineModel(sequelize);
};

export const connect = () => {
	fs.readdirSync(path.join(__dirname, 'models'), { withFileTypes: true }).forEach((file) => {
		if (file.isDirectory()) return importDirectory(path.join('models', file.name));
		else if (file.name.endsWith('.model.js')) importFile(path.join('models', file.name));
	});
	associates.forEach((associate) => associate(sequelize));
	console.log('- connected to database...');
};

export const getModel = (name: string) => sequelize.models[name];

export const field = <M extends Model>(type: DataType, comment: string, required: boolean = false, options: {} = {}): ModelAttributeColumnOptions<M> => {
	return { type, comment, allowNull: !required, ...options };
};
