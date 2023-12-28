const logError = require('./logger').error;

const tryCatch = (controller, errMessage) => async(req, res, next) => {
  try{
    await controller(req, res, next);
  }
  catch(err){
    logError(errMessage, {req, err});
    return next(err);
  }
}

class serverError extends Error{
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = {tryCatch, serverError}