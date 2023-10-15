import mongoose, { Document, Model, Schema } from "mongoose";

enum QuestionType {
  FillInBlank = "FillInBlank",
  MultipleQuestions = "MultipleQuestions",
}

interface IQuiz extends Document {
  name: string;
  questions: IQuestion[];
}

interface IQuestion {
  question: string;
  type: QuestionType;
  choices?: string[];
  correctAnswer: string;
}

const QuizSchema: Schema<IQuiz> = new mongoose.Schema({
  name: String,
  questions: [
    {
      question: String,
      type: QuestionType,
      choices: [String],
      correctAnswer: String,
    },
  ],
});

const Quiz: Model<IQuiz> = mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
