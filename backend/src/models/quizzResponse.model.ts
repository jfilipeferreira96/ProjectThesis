import mongoose, { Document, Model, Schema } from "mongoose";

export interface IQuizResponse extends Document {
  quiz: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  answers: string[];
  score: number; 
  lastUpdate?: Date;
  filename?: string | any;
}

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
  answers: [String],
  score: {
    type: Number,
    required: true,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
});

const QuizResponse: Model<IQuizResponse> = mongoose.model<IQuizResponse>("QuizResponse", QuizResponseSchema);

export default QuizResponse;
