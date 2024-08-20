import HttpStatus from 'http-status-codes';
import { ErrorCode } from '../../error/codes';

export class ApiResponseError extends Error {
  public readonly status: number;
  public readonly description: string;
  public readonly code: ErrorCode;

  public constructor(message: string, description: string, status: number, code: ErrorCode = ErrorCode.UNKNOWN_ERROR) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.description = description;
    this.code = code;
  }

  public getResponsePayload(): object {
    return {
      code: this.code,
      message: this.message,
      description: this.description
    };
  }
}

export class InternalServerError extends ApiResponseError {
  constructor(message?: string, code?: ErrorCode) {
    super(
      message ?? 'An unknown error occurred.',
      'Something unexpected happened when handling your request.',
      HttpStatus.INTERNAL_SERVER_ERROR,
      code
    );
  }
}

export class ResourceNotFoundError extends ApiResponseError {
  constructor(message: string, code?: ErrorCode) {
    super(
      message,
      'The requested resource was not found by the server.',
      HttpStatus.NOT_FOUND,
      code
    );
  }
}

export class BadRequestError extends ApiResponseError {
  constructor(message: string, code?: ErrorCode) {
    super(
      message,
      'The server could not handle your request. Please verify that your request is correct and try again.',
      HttpStatus.BAD_REQUEST,
      code
    );
  }
}

export class QueryValidationError extends ApiResponseError {
  constructor(message: string, code?: ErrorCode) {
    super(
      message,
      'The provided query data is invalid.',
      HttpStatus.BAD_REQUEST,
      code
    );
  }
}
