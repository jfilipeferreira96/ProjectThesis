import mongoose, { Document, Model, Schema } from "mongoose";

enum QuestionType {
  FillInBlank = "FillInBlank",
  MultipleQuestions = "MultipleQuestions",
}

interface IQuiz extends Document {
  user: Schema.Types.ObjectId;
  createdAt: Date;
  endDate?: Date;
  startDate?: Date;
  questions: IQuestion[];
}

interface IQuestion {
  question: string;
  type: QuestionType;
  choices?: string[];
  correctAnswer: string;
}

const QuizSchema: Schema<IQuiz> = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  endDate: Date,
  startDate: Date,
  questions: [
    {
      question: String,
      type: {
        type: String,
        enum: QuestionType,
        required: true
      },
      choices: [String],
      correctAnswer: String,
    },
  ],
});

const Quiz: Model<IQuiz> = mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
