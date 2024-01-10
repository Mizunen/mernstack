class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); //call extended class's constructor with given data
    this.code = errorCode; // adds error property
  }
}

module.exports = HttpError;
