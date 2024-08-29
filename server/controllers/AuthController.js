import userModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (userId, userEmail) => {
  return jwt.sign({ userId, userEmail }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await userModel.create({ email, password });
      res.cookie("jwt", createToken(user._id, user.email), {
        maxAge: maxAge, secure: true, someSite: "none", });
      return res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
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
