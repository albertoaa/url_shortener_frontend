const env = process.env.APP_URL;

const api_url = env || 'http://localhost:3000/api/v1';

export default api_url;
