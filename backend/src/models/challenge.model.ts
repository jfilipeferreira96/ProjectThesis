import mongoose, { Schema, Document, Model } from "mongoose";

enum ChallengeType {
    TYPE_A = 'Type A',
    TYPE_B = 'Type B',
}

enum ChallengeStatus{
    Active = 0,
    InProgress = 1,
    Completed = 2
}

interface IChallenge extends Document{
    title: string;
    description: string;
    type: ChallengeType;
    admins: Schema.Types.ObjectId[];
    participants: Schema.Types.ObjectId[];
    createdAt: Date;
    endDate?: Date;
    status: ChallengeStatus;
}

const challengeSchema: Schema<IChallenge> = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
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
});

const ChallengeModel: Model<IChallenge> = mongoose.model<IChallenge>("Challenge", challengeSchema);

export default ChallengeModel;
