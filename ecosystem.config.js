const dotenv = require('dotenv');
const ssm = require('aws-param-env');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const config = env !== 'production' ? dotenv.parse(fs.readFileSync('.env')) : ssm.load('/template-project', { region: 'ap-northeast-2' });

module.exports = {
	apps: [
		{
			name: 'template-project',
			env: config,
			script: process.env.NODE_ENV === 'production' ? './dist/index.js' : './src/index.ts',
			watch: env === 'development' ? './src' : false,
			watch_options: { followSymlinks: false },
			max_memory_restart: '200M',
			log_date_format: 'YYYY-MM-DD HH:mm Z',
			error_file: 'err.log',
			out_file: env === 'development' ? 'out.log' : '/dev/null',
			source_map_support: env === 'development',
			interpreter: 'node',
			interpreter_args: env === 'development' ? '-r ts-node/register -r dotenv/config --trace-warnings' : '',
		},
	],
};
