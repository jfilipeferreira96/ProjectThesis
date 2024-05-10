import mongoose, { Schema, Document, Model } from "mongoose";
import { User } from "../controllers/user.controller";

export enum ChallengeType {
  TYPE_EXPRESS = "Express",
  TYPE_LEAGUE = "League",
}

export enum ChallengeStatus{
    Deleted = 0,
    Active = 1,
    InProgress = 2,
    Completed = 3
}

interface IChallenge extends Document {
    title: string;
    description: string;
    type: ChallengeType;
    admins: User[];
    participants: User[];
    createdAt: Date;
    endDate?: Date;
    status: ChallengeStatus;
    quizzes: Schema.Types.ObjectId[];
    activeQuizz?: {
        id: string;
        completed: boolean;
    };
}

const challengeSchema: Schema<IChallenge> = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        enum: ChallengeType,
        required: true,
    },
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
    },
    status: {
        type: Number,
        enum: ChallengeStatus,
        default: ChallengeStatus.Active,
    },
    quizzes: [{
        type: Schema.Types.ObjectId,
        ref: 'Quizz',
    }],
});

const ChallengeModel: Model<IChallenge> = mongoose.model<IChallenge>("Challenge", challengeSchema);

export default ChallengeModel;
