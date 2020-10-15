export const isDev = () => process.env['NODE_ENV'] && process.env['NODE_ENV'] === 'development';

export const baseDomain = isDev() ? '127.0.0.1:8000' : 'lol.com';

export const wsProtocol = isDev() ? 'ws' : 'wss';

export const httpProtocol = isDev() ? 'http' : 'https';

export const baseUrl = (protocol: string) => `${protocol}://${baseDomain}`;
