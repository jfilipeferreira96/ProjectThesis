import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document
{
  fullname: string;
  email: string;
  password: string;
  avatar: string;
  studentId?: number | string;
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
    select: false,
  },
  avatar: {
    type: String,
    required: true,
  },
});

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserModel;