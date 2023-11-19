enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UN_AUTHORIZED = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    description: string,
    isOperational: boolean
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

export const namesOfErrors = {
  internalServerError: 'Internal Server Error',
  badRequest: 'Bad Request',
  unAuthorized: 'UnAuthorized',
  notFound: 'Not Found',
};

export const statusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORIZED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};
