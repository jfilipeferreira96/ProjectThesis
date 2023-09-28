import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document
{
  username: string;
  fullname: string;
  email: string;
  password: string;
  avatar: string;
  numberid?: number | string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
    min: 3,
    max: 60,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
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
});

const UserModel: Model<IUser> = mongoose.model<IUser>("Users", userSchema);

export default UserModel;
