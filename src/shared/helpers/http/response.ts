import HttpStatus from 'http-status-codes';
import { ApiResponseError } from './error';

const FIRST_UNSUCCESSFUL_STATUS_CODE = 400;

export type ValidData = object | string | number | boolean | null;

export class ResponseBuilder {
  private _success: boolean;
  private _status: number;
  private _data: ValidData | undefined;
  private _error: object | undefined;

  public constructor() {
    this._success = true;
    this._status = HttpStatus.OK;
    this._data = undefined;
    this._error = undefined;
  }

  public withStatusCode(statusCode: number) : this {
    this._status = statusCode;
    this._success = statusCode < FIRST_UNSUCCESSFUL_STATUS_CODE;
    return this;
  }

  public withData(data: ValidData): this {
    this._data = data;
    return this;
  }

  public withError(error: ApiResponseError) : this {
    this._error = error.getResponsePayload();
    return this.withStatusCode(error.status);
  }

  public build(): object {
    if (typeof this._error !== 'undefined') {
      return {
        status: this._status,
        success: this._success,
        error: this._error
      };
    }

    const data = typeof this._data !== 'undefined' ? this._data : null;
    return {
      status: this._status,
      success: this._success,
      data
    };
  }

  get code(): number {
    return this._status;
  }
}
