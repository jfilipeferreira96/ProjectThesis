
const host = process.env.NODE_ENV === 'development' ? "http://localhost:5000" : "https://chat-has8.onrender.com";
export const endpoints = {
  host: host,
  loginRoute: `${host}/api/auth/login`,
  registerRoute: `${host}/api/auth/register`,
  logoutRoute: `${host}/api/auth/logout`,
};

export const routes = {
  landingpage: {
    url: "/",
  },
  signin: {
    url: "/signin",
  },
  register: {
    url: "/register",
  },
  home: {
    url: "/home",
  },
  leagues: {
    url: "/leagues",
  },
  teams: {
    url: "/teams",
  },
};