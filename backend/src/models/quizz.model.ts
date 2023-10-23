import mongoose, { Document, Model, Schema } from "mongoose";

enum QuestionType {
  FillInBlank = "FillInBlank",
  MultipleQuestions = "MultipleQuestions",
}

export enum Status{
  PendingStart = 0,
  InProgress = 1,
  Completed = 3
}

interface IQuiz extends Document {
  user: Schema.Types.ObjectId;
  createdAt: Date;
  endDate?: Date;
  startDate?: Date;
  challenge: Schema.Types.ObjectId;
  questions: IQuestion[];
  status: Status;
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
  status: {
    type: Number,
    enum: Status,
    default: Status.PendingStart,
  },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
  questions: [
    {
      question: String,
      type: {
        type: String,
        enum: QuestionType,
        required: true,
      },
      choices: [String],
      correctAnswer: String,
    },
  ],
});

const Quiz: Model<IQuiz> = mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
