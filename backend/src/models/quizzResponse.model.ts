import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAnswer {
  answer: string | File | any;
  pontuation?: number;
  _id: Schema.Types.ObjectId | string;
}

export interface IBadge {
  badge?: string;
  img?: string;
  description?: string;
}

export interface IQuizResponse extends Document {
  quiz: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  answers: IAnswer;
  score: number;
  lastUpdate?: Date;
  filename?: string | any;
  reviewed?: boolean;
  seconds?: number;
  badges?: IBadge[];
}

const AnswerSchema: Schema<IAnswer> = new mongoose.Schema({
  answer: {
    type: String,
    required: true,
  },
  pontuation: {
    type: Number,
    default: 0,
  },
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});


const QuizResponseSchema: Schema<IQuizResponse> = new mongoose.Schema({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [AnswerSchema],
  badges: [
    {
      badge: {
        type: String,
        required: true,
      },
      img: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: false,
      },
    },
  ],
  score: {
    type: Number,
    required: true,
  },
  seconds: {
    type: Number,
    required: true,
    default: 0,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
  reviewed: {
    type: Boolean,
    default: false,
  },
});

const QuizResponse: Model<IQuizResponse> = mongoose.model<IQuizResponse>("QuizResponse", QuizResponseSchema);

export default QuizResponse;
