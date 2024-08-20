import { QueryValidationError } from '../helpers/http/error';
import { ErrorCode } from '../error/codes';

export function getValidatedPartialLimit(limit: unknown): number | undefined;
export function getValidatedPartialLimit(limit: unknown, defaultValue: number): number;
export function getValidatedPartialLimit(limit: unknown, defaultValue?: number): number | undefined {
  if (!limit) {
    return defaultValue;
  }

  const parsed = parseInt(limit as string, 10);

  if (isNaN(parsed)) {
    throw new QueryValidationError('Limit must be a number.', ErrorCode.INVALID_QUERY_PROVIDED);
  }
  if (parsed < 1) {
    throw new QueryValidationError('Limit must be at least 1.', ErrorCode.INVALID_QUERY_PROVIDED);
  }

  return parsed;
}
