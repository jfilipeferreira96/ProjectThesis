
const host = process.env.NODE_ENV === 'development' ? "http://localhost:5000" : process.env.API;
console.log("process.env.NODE_ENV", process.env.NODE_ENV, process.env.NEXT_PUBLIC_NODE_ENV)

console.log("process.env.API", process.env.API)
export const endpoints = {
  host: host,
  /*################## Auth #############################*/
  loginRoute: `${host}/api/auth/login`,
  registerRoute: `${host}/api/auth/register`,
  logoutRoute: `${host}/api/auth/logout`,
  /*################## Challenges #############################*/
  createChallengeRoute: `${host}/api/challenges/create`,
  editChallengeRoute: `${host}/api/challenges/edit`,
  getChallengesByUserId: `${host}/api/challenges`,
  getSingleChallenge: `${host}/api/challenges/`,
  joinChallenge: `${host}/api/challenges/join`,
  getAllChallengeQuizzes: `${host}/api/challenges/quizzes/`,
  addAdminRoute: `${host}/api/challenges/admin/add`,
  removeAdminRoute: `${host}/api/challenges/admin/remove`,
  /*################## Quizz #############################*/
  createQuizzRoute: `${host}/api/quizz/create`,
  editQuizzRoute: `${host}/api/quizz/edit`,
  editQuizzStatusRoute: `${host}/api/quizz/editStatus`,
  deleteQuizzRoute: `${host}/api/quizz/delete`,
  getSingleQuizz: `${host}/api/quizz/`,
  saveQuizAnswerRoute: `${host}/api/quizz/answer`,
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
  }
};