
const host = process.env.NODE_ENV === 'development' ? "http://localhost:5000" : "https://chat-has8.onrender.com";
export const endpoints = {
  host: host,
  loginRoute: `${host}/api/auth/login`,
  registerRoute: `${host}/api/auth/register`,
  logoutRoute: `${host}/api/auth/logout`,
  createChallengeRoute: `${host}/api/challenges/create`,
  getChallengesByUserId: `${host}/api/challenges`,
  getSingleChallenge: `${host}/api/challenges/`,
  joinChallenge: `${host}/api/challenges/join`,
  getAllChallengeQuizzes: `${host}/api/challenges/quizzes/`,
  createQuizzRoute: `${host}/api/quizz/create`,
  editQuizzRoute: `${host}/api/quizz/edit`,
  editQuizzStatusRoute: `${host}/api/quizz/editStatus`,
  deleteQuizzRoute: `${host}/api/quizz/delete`,
  getSingleQuizz: `${host}/api/quizz/`,
  SaveQuizAnswerRoute: `${host}/api/quizz/answer`,
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
  challenge: {
    url: "/challenge",
    create: {
      url: "/challenge/create"
    }
  },
  teams: {
    url: "/teams",
  },
};