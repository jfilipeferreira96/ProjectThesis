export const host = process.env.NODE_ENV === 'development' ? "http://localhost:5000" : "https://chat-has8.onrender.com";
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
