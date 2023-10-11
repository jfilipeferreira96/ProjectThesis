import mongoose, { Document, Model, Schema } from "mongoose";

enum QuestionType {
  FillInBlank = "FillInBlank",
  MultipleQuestions = "MultipleQuestions",
}

interface IQuizz extends Document {
  id: number;
  question: string;
  type: QuestionType;
  choices?: string[];
  correctAnswer: string;
}

const QuizzSchema: Schema<IQuizz> = new mongoose.Schema({
  id: Number,
  question: String,
  type: QuestionType,
  choices: [String],
  correctAnswer: String,
});

const Quizz: Model<IQuizz> = mongoose.model<IQuizz>("Quizz", QuizzSchema);

export default Quizz;
