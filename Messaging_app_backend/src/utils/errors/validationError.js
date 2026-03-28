import { StatusCodes } from "http-status-codes";

class validationError extends Error {
  constructor(errorDetails, message) {
    super(message);
    this.name = "ValidationError";

    let explaination = [];
    Object.keys(errorDetails.error).forEach((key) => {
      explaination.push(errorDetails.error[key]);
    });

    this.message = message;
    this.explaination = explaination;
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default validationError;
