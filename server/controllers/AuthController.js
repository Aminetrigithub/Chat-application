import userModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import bcrypt from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (userId, userEmail) => {
  return jwt.sign({ userId, userEmail }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email !== "" && password !== "") {
      const user = await userModel.create({ email, password });
      res.cookie("jwt", createToken(user._id, user.email), {
        maxAge: maxAge,
        secure: true,
        someSite: "none",
      });
      console.log(res.cookie());
      return res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          profileSetup: user.profileSetup,
        },
      });
    } else {
      return res.status(400).send("Email and password are required");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await userModel.findOne({ email });
      if (!user) return res.status(404).send("User not found");
      const auth = await compare(password, user.password);
      if (!auth) return res.status(400).send("email or password is incorrect");
      res.cookie("jwt", createToken(user.id, user.email), {
        maxAge: maxAge,
        secure: true,
        someSite: "none",
      });
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          profileSetup: user.profileSetup,
          color: user.color,
        },
      });
    } else {
      return res.status(400).send("Email and password are required");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await userModel.findById(req.userId);
    if (!userData)
      return res.status(404).send("User with the given IDnot found");

    return res.status(200).json({
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        profileSetup: userData.profileSetup,
        color: userData.color,
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};
