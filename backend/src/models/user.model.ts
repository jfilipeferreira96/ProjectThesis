import mongoose, { Schema, Document, Model } from "mongoose";

export enum UserType{
  STUDENT = "Student",
  TEACHER = "Teacher"
}

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  avatar: string;
  studentId?: number | string;
  type: UserType | null; 
  createdAt: Date;
  score?: number
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    min: 5,
    max: 60,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  studentId: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  avatar: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [null, ...Object.values(UserType)],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserModel;
