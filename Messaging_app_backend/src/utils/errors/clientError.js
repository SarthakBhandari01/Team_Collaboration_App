import { StatusCodes } from "http-status-codes";

class ClientError extends Error {
  constructor(error) {
    super();
    this.name = "Client Error";
    this.message = error.message;
    this.explaination = error.explaination;
    this.statusCode = error.statusCode
      ? error.statusCode
      : StatusCodes.BAD_REQUEST;
  }
}

export default ClientError;
