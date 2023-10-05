import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Challenge from "../models/challenge.model";
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class ChallengeController {
  static async CreateChallenge(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, type } = req.body;
      const user = req.user;

      const challenge = await Challenge.create({
        title,
        description,
        type,
        admins: [user._id],
      });

      return res.status(200).json({
        status: true,
        id: challenge._id,
      });
    } catch (ex) {
      next(ex);
    }
  }

  static async GetChallengesByUserId(req: Request, res: Response, next: NextFunction) {
    
    try {
      const user = req.user;
      
      let challenges = await Challenge.find({
        $or: [{ admins: user._id }, { participants: user._id }],
      }).exec();

      const sendObj = challenges.map((challenge) => {
        return {
          ...challenge.toObject(), 
          user_type: challenge.admins.includes(mongoose.Types.ObjectId(user._id)) ? "Admin" : "Participant",
        };
      });

      return res.status(200).json({
        status: true,
        challenges: sendObj,
      });
    } catch (error) {
      throw new Error("Error fetching challenges: " + error);
    }
  }

  static async GetSingleChallenge(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const id = req.params.id;

      const challenge = await Challenge.findOne({ _id: id });

      console.log(challenge);
      return res.status(200).json({
        status: true,
        challenge: challenge,
      });
    } catch (error) {
      throw new Error("Error fetching challenges: " + error);
    }
  }
}

export default ChallengeController;
