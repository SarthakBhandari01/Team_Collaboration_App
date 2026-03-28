import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";

import userRepository from "../repositories/userRepository.js";
import { generateToken } from "../utils/common/generateToken.js";
import ClientError from "../utils/errors/clientError.js";
import validationError from "../utils/errors/validationError.js";

export const signUpService = async (user) => {
  try {
    const newUser = await userRepository.create(user);
    return newUser;
  } catch (error) {
    // console.log("User service error ", error);
    if (error.name === "ValidationError") {
      throw new validationError({ error: error.errors }, error.message);
    }
    if (error.name === "MongoServerError" && error.code === 11000) {
      throw new validationError(
        {
          error: ["A user with same  email or username already exists"],
        },
        "A user with same  email or username already exists"
      );
    }
  }
};

export const signInService = async (userDetails) => {
  try {
    // 1.check if there is a valid register user with the email
    const user = await userRepository.getByEmail(userDetails.email);
    if (!user) {
      throw new ClientError({
        message: "User not found with this email",
        explaination: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // 2. compare the password
    const isValidPassword = bcrypt.compareSync(
      userDetails.password,
      user.password
    );

    if (!isValidPassword) {
      throw new ClientError({
        message: "Invalid Password",
        explaination: "Invalid data sent from the user",
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    return {
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      _id:user._id,
      token: generateToken({
        email: user.email,
        username: user.username,
        _id: user._id,
      }),
    };
  } catch (error) {
    console.log("User service error ", error);
    throw error;
  }
};
