import { StatusCodes } from "http-status-codes";

import { customErrorResponse } from "../utils/common/responseObject.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      const explaination = [];
      error.errors.forEach((key) => {
        explaination.push(key.message);
      });
      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: "Validation Error ",
          explaination: explaination,
        })
      );
    }
  };
};
