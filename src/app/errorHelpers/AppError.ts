// globalErrorHandler er moddhe status code ta amra harly set koreci. But amra dynamicaly bosar jonno AppError namer akta class create kore nibo. Because Javascript er Error er moddhe statusCode property nai. So AppError class er moddhe Error er all property extends kore nia aslam and tar sathe statusCode property kew set korlam.
// Jar fole amra age error trhow kortam sudho message dia. Ex: throw new Error("error message") ke call kortam. But Akhon AppError ke call korbo. Jar fole statusCode and errorMessage 2tai send korte parbo. Ai AppError ke use korbo akhon globalErrorHandler er moddhe.
class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
