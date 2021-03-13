import crypto from 'crypto';
import axios from 'axios';

interface EmailRecipient {
	address: string;
	name: string;
	type: string;
	parameters: {};
}

interface SMSRecipient {
	to: string;
	name?: string;
}

type Method = 'POST';

const byteSize = (text: string) => text.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g, '$&$1$2').length;

const generateSignature = ({ method, url }: { method: Method; url: string }): string => {
	const accessKey = <string>process.env.NCLOUD_ACCESS_KEY;
	const secretKey = <string>process.env.NCLOUD_SECRET_KEY;
	const hmac = crypto.createHmac('sha256', secretKey);
	hmac.update(`${method} ${url}\n${Date.now()}\n${accessKey}`);
	return hmac.digest('base64');
};

export const generateEmailRecipient = (email: string, name: string = '', type: string = 'R', parameters: {} = {}): EmailRecipient => ({
	address: email,
	name: name || email,
	type,
	parameters,
});

export const sendEmail = async (recipients: Array<EmailRecipient>, title: string, body: string): Promise<{}> => {
	const url = 'https://mail.apigw.ntruss.com/api/v1/mails';
	const headers = {
		'Content-Type': 'application/json',
		'x-ncp-apigw-timestamp': Date.now(),
		'x-ncp-iam-access-key': process.env.NCLOUD_ACCESS_KEY,
		'x-ncp-apigw-signature-v2': generateSignature({ method: 'POST', url: '/api/v1/mails' }),
	};
	const senderAddress = 'noreply@template-project.com';
	const senderName = 'template-project';
	const { data } = await axios.post(url, { senderAddress, senderName, title, body, recipients }, { headers });
	return data;
};

export const sendSMS = async (recipients: Array<SMSRecipient>, content: string, contentType: string = '', subject: string = ''): Promise<{}> => {
	const url = 'https://sens.apigw.ntruss.com/sms/v2/services/ncp%3Asms%3Akr%3A256544365784:soolmeet/messages';
	const headers = {
		'Content-Type': 'application/json',
		'x-ncp-apigw-timestamp': Date.now(),
		'x-ncp-iam-access-key': process.env.NCLOUD_ACCESS_KEY,
		'x-ncp-apigw-signature-v2': generateSignature({ method: 'POST', url: '/sms/v2/services/[project-specific-value]/messages' }),
	};
	const type = byteSize(content) <= 80 ? 'SMS' : 'LMS';
	const from = process.env.NCLOUD_PHONE_NUMBER;
	const { data } = await axios.post(url, { type, from, subject, contentType, content, messages: recipients.map((to) => ({ to })) }, { headers });
	return data;
};
