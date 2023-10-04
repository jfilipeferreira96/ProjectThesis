import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Challenge from "../models/challenge.model";


class ChallengeController {

  static async CreateChallenge(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, type } = req.body;
      console.log(req);

      /* const emailCheck = await User.findOne({ email });
      
      if (emailCheck) {
         return res.json({ error: "Bad Request", message: "Email already used" });
      } */
       
      const challenge = await Challenge.create({
        title,
        description,
        type,
        admins: []
      });
      console.log(challenge)
      return res.status(200).json({
        status: true,
        
      });
    } catch (ex) {
      next(ex);
    }
  }

}

export default ChallengeController;
