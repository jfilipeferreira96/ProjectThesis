import mongoose, { Document, Model, Schema } from "mongoose";

export enum QuestionType {
  FillInBlank = "FillInBlank",
  MultipleQuestions = "MultipleQuestions",
  FileUpload = "FileUpload",
}

export enum EvalutionType {
  Automatic = "Automatic",
  Manual = "Manual",
}

export enum Status {
  PendingStart = 0,
  InProgress = 1,
  Completed = 2,
}

interface IQuiz extends Document {
  user: Schema.Types.ObjectId;
  createdAt: Date;
  name: String;
  endDate?: Date;
  startDate?: Date;
  evaluation: EvalutionType;
  challenge: Schema.Types.ObjectId;
  questions: IQuestion[];
  status: Status;
}

interface IQuestion {
  _id?: string;
  question: string;
  type: QuestionType;
  choices?: string[];
  correctAnswer: string;
  pontuation?: number;
}

const QuizSchema: Schema<IQuiz> = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  endDate: Date,
  startDate: Date,
  evaluation: {
    type: String,
    enum: EvalutionType,
    required: true,
  },
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
      pontuation: Number
    },
  ],
});

const Quiz: Model<IQuiz> = mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
