import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Quizz, { EvalutionType, Status } from "../models/quizz.model";
import { ObjectId } from "mongodb";
import Challenge from "../models/challenge.model";
import Logger from "../utils/logger";
import QuizResponse, { IAnswer, IQuizResponse } from "../models/quizzResponse.model";
import User from "../models/user.model";
import fs from "fs";
import path from "path";

class QuizzController {
  static async GetSingleQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
      const quiz = await Quizz.findById(quizId);
      const user: any = req.user;

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quizz not found",
        });
      }

      const challenge = await Challenge.findById(quiz.challenge);
      if (!challenge) {
        return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Challenge not found" });
      }

      const userIsAdmin = challenge.admins.some((admin) => admin._id.toString() === user._id);

      if (userIsAdmin) {
        //Sends the quiz to edit
        return res.status(StatusCodes.OK).json({
          status: true,
          quiz,
        });
      } else {
        if (quiz.status === Status.Completed) {
          return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Quiz is completed" });
        }

        if (quiz.status === Status.PendingStart) {
          return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Quiz is yet to be started" });
        }

        //VERIFICAR SE O ALUNO JA RESPONDEU AO QUIZ
        /* if (quiz.status === Status.PendingStart)
        {
          return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "You have already awnsered this quiz." });
        } */

        // Sends the user the quiz without the correct awnsers in the form
        const questionsWithoutCorrectAnswer = quiz.questions.map((question) => {
          return {
            _id: question._id,
            question: question.question,
            type: question.type,
            choices: question.choices,
          };
        });

        return res.status(StatusCodes.OK).json({
          status: true,
          questions: questionsWithoutCorrectAnswer,
          shuffle: quiz.shuffle,
          sounds: quiz.sounds,
          evaluation: quiz.evaluation,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async AddQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const { questions, challengeId, name, startdate, enddate, evaluation, shuffle, sounds } = req.body;
      const user = req.user;

      const quiz = await Quizz.create({
        user,
        name,
        evaluation,
        startDate: startdate,
        endDate: enddate,
        questions,
        challenge: challengeId,
        shuffle,
        sounds,
      });

      const challenge = await Challenge.findByIdAndUpdate(challengeId, { $push: { quizzes: quiz._id } }, { new: true });

      return res.status(StatusCodes.OK).json({
        status: true,
        id: quiz._id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async EditQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizzId, questions, challengeId, name, startdate, enddate, shuffle, sounds } = req.body;
      const user: any = req.user;

      const quiz = await Quizz.findById(quizzId);

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quizz not found",
        });
      }

      const challenge = await Challenge.findOne({ quizzes: quiz._id });

      if (!challenge) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Challenge not found",
        });
      }

      const isAdmin = challenge.admins.some((admin) => admin._id.toString() === user._id);

      if (isAdmin) {
        const updatedQuiz = await Quizz.findByIdAndUpdate(
          quizzId,
          {
            name,
            startDate: startdate,
            endDate: enddate,
            questions,
          },
          { new: true }
        );

        return res.status(StatusCodes.OK).json({
          status: true,
          quiz: updatedQuiz,
        });
      } else {
        return res.status(StatusCodes.FORBIDDEN).json({
          status: false,
          message: "Permission denied. User is not an admin of the challenge.",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async EditQuizStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.body.quizId;
      const newStatus = req.body.status;
      const user: any = req.user;

      const quiz = await Quizz.findById(quizId);

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quiz not found",
        });
      }

      const challenge = await Challenge.findOne({ quizzes: quiz._id });

      if (!challenge) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Challenge not found",
        });
      }

      const isAdmin = challenge.admins.some((admin) => admin._id.toString() === user._id);

      if (isAdmin) {
        quiz.status = newStatus;
        const updatedQuiz = await quiz.save();

        return res.status(StatusCodes.OK).json({
          status: true,
          message: "Quiz updated successfully",
          updatedQuiz,
        });
      } else {
        return res.status(StatusCodes.FORBIDDEN).json({
          status: false,
          message: "Permission denied. User is not an admin of the challenge.",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async DeleteQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.body.quizId;
      const user: any = req.user;

      const quiz = await Quizz.findByIdAndDelete(quizId);
      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quizz not found",
        });
      }

      const challenge = await Challenge.findOne({ quizzes: quiz._id });
      if (!challenge) {
        Logger.error("Challenge not found");

        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Challenge not found",
        });
      }

      const isAdmin = challenge.admins.some((admin) => admin._id.toString() === user._id);
      if (isAdmin) {
        const deletedQuiz = await Quizz.findByIdAndDelete(quizId);

        return res.status(StatusCodes.OK).json({
          status: true,
          message: "Quizz deleted successfully",
          deletedQuiz,
        });
      } else {
        Logger.error("Permission denied. User is not an admin of the challenge.");
        return res.status(StatusCodes.FORBIDDEN).json({
          status: false,
          message: "Permission denied. User is not an admin of the challenge.",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async SaveQuizAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId, userAnswers } = req.body;

      let answersArray = userAnswers;
      const user: any = req.user;

      // Check if the quiz exists
      const quiz = await Quizz.findById(quizId);
      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quiz not found",
        });
      }

      // Check if the user is not an admin
      const challenge = await Challenge.findOne({ quizzes: quiz._id });
      if (!challenge) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Challenge not found",
        });
      }

      const isAdmin = challenge.admins.some((admin) => admin._id.toString() === user._id);
      if (isAdmin) {
        return res.status(StatusCodes.FORBIDDEN).json({
          status: false,
          message: "Permission denied. Admins cannot answer quizzes.",
        });
      }

      // Check if the quiz status is InProgress
      if (quiz.status !== Status.InProgress) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quiz is not in progress",
        });
      }

      // Loop dos arquivos enviados
      // Verifica se req.files é um array de arquivos
      if (Array.isArray(req.files) && req.files.length > 0) {
        // Loop através dos arquivos enviados e mova-os para a pasta de armazenamento
        req.files.forEach((file) => {
          const [questionId, fileName] = file.originalname.split("#");

          const storagePath = `src/storage/${questionId}/${user._id}`;
          //Tratamento de ficheiros
          if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath, { recursive: true });
          }

          const filePath = path.join(storagePath, fileName);
          fs.writeFileSync(filePath, file.buffer);

          //fix: adiciona ao userAnswers o path como string
          answersArray = answersArray.map((ans: IAnswer) => {
            if (ans._id === questionId && ans.answer === undefined) {
              return {
                ...ans,
                answer: fileName,
              };
            } else {
              return ans;
            }
          });
        });
      }

      let score = 0;
      let correctAnswers = 0;
      let wrongAnswers = 0;

      let answersToSave: IAnswer[] = answersArray;
      if (quiz.evaluation === EvalutionType.Automatic) {
        answersArray.forEach((userAnswer: IAnswer, index: number) => {
          const question = quiz.questions.find((q) => q._id && q._id.toString() === userAnswer._id);
          const answer = userAnswer.answer;

          if (question) {
            let questionScore = question.pontuation || 5;
            if (question.type === "FillInBlank") {
              if (answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
                score += questionScore;
                correctAnswers += 1;
                answersToSave[index].pontuation = questionScore;
              } else {
                wrongAnswers += 1;
              }
            } else {
              if (answer === question.correctAnswer) {
                score += questionScore;
                correctAnswers += 1;
                answersToSave[index].pontuation = questionScore;
              } else {
                wrongAnswers += 1;
              }
            }
          }
        });
      }

      // Create and save quiz response
      const quizResponseData = {
        quiz: quizId,
        user: user._id,
        answers: answersToSave,
        score: score,
      };

      const quizResponse = await QuizResponse.create(quizResponseData);

      let sendObj: any = {
        status: true,
        message: "Quiz response saved successfully",
      };

      if (quiz.evaluation === EvalutionType.Automatic) {
        sendObj = {
          ...sendObj,
          data: {
            score: score,
            correctAnswers: correctAnswers,
            wrongAnswers: wrongAnswers,
            userAnswers: answersToSave,
          },
        };
      }

      return res.status(StatusCodes.OK).json(sendObj);
    } catch (error) {
      next(error);
    }
  }

  static async DownloadAnswerFile(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.questionId;
      const userId = req.params.userId;

      if (!questionId || !userId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: false,
          message: "Missing params",
        });
      }

      const answerFilePath = await QuizzController.findQuestionFile(questionId, userId);
      if (!answerFilePath) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "File not found",
        });
      }

      const fileInfo = path.parse(answerFilePath);

      res.download(answerFilePath, `${fileInfo.name}${fileInfo.ext}`, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal server error",
          });
        }
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Internal server error",
      });
    }
  }

  static async findQuestionFile(questionId: string, userId: string): Promise<string | null> {
    const storagePath = `src/storage/${questionId}/${userId}`;

    if (fs.existsSync(storagePath)) {
      const files = fs.readdirSync(storagePath);

      if (files.length > 0) {
        const filePath = path.join(storagePath, files[0]);
        return filePath;
      }
    }

    return null;
  }

  static async GetListOfUserAnswersPerQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
      const userId: any = req.user._id;

      const quiz = await Quizz.findById(quizId);

      if (!quiz) {
        return res.status(StatusCodes.OK).json({
          status: false,
          message: "Quizz not found",
        });
      }

      const challenge = await Challenge.findById(quiz.challenge);
      if (!challenge) {
        return res.status(StatusCodes.OK).json({ status: false, message: "Challenge not found" });
      }

      if (!challenge.admins.some((admin) => admin._id.toString() === userId.toString())) {
        Logger.error("No permissions");
        return res.status(StatusCodes.OK).json({
          status: false,
          message: "No permissions",
        });
      }

      const quizResponses: IQuizResponse[] = await QuizResponse.find({ quiz: quizId }).populate("user").exec();

      if (!quizResponses || quizResponses.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: true,
          message: "No responses found for this quiz",
        });
      }

      const responsesWithUserInfo = quizResponses.map((response) => ({
        user: response.user,
        answers: response.answers,
        score: response.score,
        lastUpdate: response.lastUpdate,
        filename: response.filename,
        reviewed: response.reviewed,
      }));

      if (responsesWithUserInfo.some((response) => response.reviewed === false)) {
        // Order responses by 'reviewed' with false values first
        responsesWithUserInfo.sort((a, b) => (a.reviewed === false ? -1 : b.reviewed === false ? 1 : 0));
      }

      return res.status(StatusCodes.OK).json({
        status: true,
        data: responsesWithUserInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  static async UpdateUserPontuationOfQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, quizzId, newAnswers } = req.body;

      // Check if the required fields are present in the request body
      if (!userId || !quizzId || !newAnswers) {
        return res.status(StatusCodes.OK).json({
          status: false,
          message: "Missing required fields in the request body",
        });
      }

      // Check if the user and quiz exist
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }

      const quizExists = await Quizz.exists({ _id: quizzId });
      if (!quizExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quiz not found",
        });
      }

      // Get the user's response for the quiz
      let quizResponse: IQuizResponse | null = await QuizResponse.findOne({ quiz: quizzId, user: userId });

      if (!quizResponse) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: true,
          message: "No response found for this quiz and user",
        });
      }

      // Replace the current answers with the new ones
      quizResponse.answers = newAnswers;

      let totalScore = 0;

      // Calculate the new score and update the pontuations of each answer
      for (const answer of newAnswers) {
        totalScore += answer.pontuation;
      }

      // Update the response's score
      quizResponse.score = totalScore;
      quizResponse.reviewed = true;

      // Save the updated response to the database
      await quizResponse.save();

      return res.status(StatusCodes.OK).json({
        status: true,
        message: "Quizz updated successfully",
        score: totalScore,
      });
    } catch (error) {
      next(error);
    }
  }

  static async QuizzEndCalculateBadges(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizzId } = req.body;

      // Check if the required fields are present in the request body
      if (!quizzId) {
        return res.status(StatusCodes.OK).json({
          status: false,
          message: "The following fields are missing: quizzId ",
        });
      }

      const quizExists = await Quizz.exists({ _id: quizzId });
      if (!quizExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quiz not found",
        });
      }

      // Get the every quizz response
      let quizResponse: IQuizResponse | null = await QuizResponse.findById({ quiz: quizzId });

      if (!quizResponse) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: true,
          message: "No responses found for this quizz",
        });
      }

      //Para todos os QuizResponses encontrar o UserId com maior tempo da variavel seconds
      // adicionar ao quizResponse.badge correspondente {badge: "The Sloth", img: "/badges/sloth.png"}

      //Para todos os QuizResponses encontrar o UserId com o menor tempo da variavel seconds
      // adicionar ao quizResponse.badge correspondente {badge: "The Flash", img: "/badges/flash.png"}

      //Para todos os QuizResponses entrar na variavel answers verificar se existe e se tem length > 0
      // Cria uma variavel Superstart = true;
      //Para as answers devo efetuar um loop e para cada answer verificar a pontuation atribuida e verificar se a pontuanção é igual ou maior à da Quizz.question._id correspondente. Caso alguma comparação seja false entao coloca a variavel superstar = false.
      //Ou seja para cada aluno, vamos verificar se este aluno acertou em todas as questões caso tenha acertado entao recebe -> quizResponse.badge correspondente {badge: "Superstar", img: "/badges/superstar.png"}

      //gravar todos os encontrados acima e returnar status ok
      return res.status(StatusCodes.OK).json({
        status: true,
        message: "Badges Updated",
      });
      
    } catch (error) {
      next(error);
    }
  }
}

export default QuizzController;
