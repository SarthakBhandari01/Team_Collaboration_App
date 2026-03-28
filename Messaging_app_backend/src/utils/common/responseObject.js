export const internalErrorResponse = (error) => {
  return {
    success: false,
    err: error,
    data: {},
    message: "Internal server error",
  };
};
export const customErrorResponse = (error) => {
  if (!error.message && !error.explaination) {
    return internalErrorResponse(error);
  }
  return {
    success: false,
    err: error.explaination,
    data: {},
    message: error.message,
  };
};

export const successResponse = (data, message) => {
  return {
    success: true,
    data: data,
    message: message,
    err: {},
  };
};
