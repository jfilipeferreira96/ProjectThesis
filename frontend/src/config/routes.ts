
const host = process.env.NEXT_PUBLIC_API; 

export const endpoints = {
  host: host,
  /*################## Auth #############################*/
  loginRoute: `/api/auth/login`,
  registerRoute: `/api/auth/register`,
  logoutRoute: `/api/auth/logout`,
  updateAccount: `/api/auth/account`,
  /*################## Challenges #############################*/
  createChallengeRoute: `/api/challenges/create`,
  editChallengeRoute: `/api/challenges/edit`,
  getChallengesByUserId: `/api/challenges`,
  getSingleChallenge: `/api/challenges/`,
  joinChallenge: `/api/challenges/join`,
  getAllChallengeQuizzes: `/api/challenges/quizzes/`,
  addAdminRoute: `/api/challenges/admin/add`,
  removeAdminRoute: `/api/challenges/admin/remove`,
  /*################## Quizz #############################*/
  createQuizzRoute: `/api/quizz/create`,
  editQuizzRoute: `/api/quizz/edit`,
  editQuizzStatusRoute: `/api/quizz/editStatus`,
  deleteQuizzRoute: `/api/quizz/delete`,
  getSingleQuizz: `/api/quizz/`,
  saveQuizAnswerRoute: `/api/quizz/answer`,
  getAnswers: `/api/quizz/answers/`,
  editQuizzPontuationRoute: `/api/quizz/updateUserPontuation/`,
  downloadFile: `/api/quizz/download/`,
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
  account: {
    url: "/account",
  },
  home: {
    url: "/home",
  },
  challenge: {
    url: "/challenge",
    create: {
      url: "/challenge/create",
    },
  },
};