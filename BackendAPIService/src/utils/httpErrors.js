'use strict';

/**
 * Base HTTP Error
 */
class HttpError extends Error {
  constructor(statusCode, message, code = undefined, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', code, details) {
    super(400, message, code, details);
  }
}
class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', code, details) {
    super(401, message, code, details);
  }
}
class NotFoundError extends HttpError {
  constructor(message = 'Not Found', code, details) {
    super(404, message, code, details);
  }
}
class ConflictError extends HttpError {
  constructor(message = 'Conflict', code, details) {
    super(409, message, code, details);
  }
}
class UnprocessableEntityError extends HttpError {
  constructor(message = 'Unprocessable Entity', code, details) {
    super(422, message, code, details);
  }
}
class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error', code, details) {
    super(500, message, code, details);
  }
}

/**
 * Converts an Error into a normalized API error payload and status.
 * Ensures consistent error structure across controllers.
 */
function toErrorResponse(err) {
  const status = err.statusCode || 500;
  const payload = {
    status: 'error',
    code: status,
    message: err.message || 'Internal Server Error',
  };
  if (err.details) payload.details = err.details;
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.trace = err.stack;
  }
  return { status, payload };
}

module.exports = {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  InternalServerError,
  toErrorResponse,
};
