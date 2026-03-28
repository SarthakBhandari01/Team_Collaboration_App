import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";

import transporter from "../config/mailConfig.js";
import { FRONTEND_URL, MAIL_ID } from "../config/serverConfig.js";
import userRepository from "../repositories/userRepository.js";
import { generateToken } from "../utils/common/generateToken.js";
import ClientError from "../utils/errors/clientError.js";
import validationError from "../utils/errors/validationError.js";

const sendWelcomeEmail = async (user) => {
  try {
    const mailOptions = {
      from: `"Team Collaboration" <${MAIL_ID}>`,
      to: user.email,
      subject: "Welcome to Team Collaboration! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #611f69 0%, #4a154b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #611f69; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome, ${user.username}! 👋</h1>
            </div>
            <div class="content">
              <p>Your account has been created successfully!</p>
              <p>You can now:</p>
              <ul>
                <li>Create or join workspaces</li>
                <li>Collaborate with your team in channels</li>
                <li>Send direct messages to colleagues</li>
                <li>Stay updated with real-time notifications</li>
              </ul>
              <p>Get started by signing in and creating your first workspace or joining an existing one.</p>
              <a href="${FRONTEND_URL}/auth/signin" class="button">Sign In Now</a>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Team Collaboration. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to:", user.email);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    // Don't throw - email failure shouldn't block signup
  }
};

export const signUpService = async (user) => {
  try {
    const newUser = await userRepository.create(user);

    // Send welcome email asynchronously
    sendWelcomeEmail(newUser);

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
        "A user with same  email or username already exists",
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
      user.password,
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
      _id: user._id,
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
