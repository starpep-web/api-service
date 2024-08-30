import { Request } from 'express';
import { BadRequestError } from '../helpers/http/error';
import { ErrorCode } from '../error/codes';

export interface PaginationRequest {
  page: number
  limit: number
  start: number
}

export interface Pagination {
  currentIndex: number
  total: number
  currentPage: number
  totalPages: number
  previousStart: number
  nextStart: number
  isFirstPage: boolean
  isLastPage: boolean
}

export type WithPagination<T> = {
  data: T[]
  pagination: Pagination
}

export const NULL_PAGINATION: Pagination = {
  currentIndex: 0,
  total: 0,
  currentPage: 1,
  totalPages: 0,
  previousStart: 0,
  nextStart: 0,
  isFirstPage: true,
  isLastPage: true
};

const validateCreatePaginationParameters = (start: number, total: number, step: number) => {
  if (!Number.isInteger(start) || start < 0) {
    throw new BadRequestError('Start must be a positive integer.', ErrorCode.INVALID_QUERY_PROVIDED);
  }

  if (!Number.isInteger(total) || total < 0) {
    throw new BadRequestError('Total must be a positive integer.', ErrorCode.INVALID_QUERY_PROVIDED);
  }

  if (!Number.isInteger(step) || step < 1) {
    throw new BadRequestError('Step must be a non-zero positive integer.', ErrorCode.INVALID_QUERY_PROVIDED);
  }

  if (total !== 0 && start >= total) {
    throw new BadRequestError('Start must be lesser than total. Make sure you have passed a valid page in query parameters.', ErrorCode.INVALID_QUERY_PROVIDED);
  }
};

export const createPagination = (start: number, total: number, step: number): Pagination => {
  validateCreatePaginationParameters(start, total, step);
  const currentPage = total === 0 ? 1 : Math.floor(start / step) + 1;
  const totalPages = Math.ceil(total / step);

  return {
    currentIndex: start,
    total,

    currentPage,
    totalPages,

    previousStart: total === 0 ? 0 : Math.max(start - step, 0),
    nextStart: Math.min(start + step, Math.max((totalPages - 1) * step, 0)),

    isFirstPage: currentPage === 1 || total === 0,
    isLastPage: currentPage === totalPages || total === 0
  };
};

export const resolvePaginationRequest = (req: Request, limitFallback: number = 100): PaginationRequest => {
  const MIN_LIMIT = 10;
  const MAX_LIMIT = 100;
  const DEFAULT_PAGE = 1;

  const { page: pageParam, limit: limitParam } = req.query;

  const page = Math.max(typeof pageParam === 'string' ? parseInt(pageParam, 10) : DEFAULT_PAGE, DEFAULT_PAGE);
  const limit = Math.min(
    Math.max(
      typeof limitParam === 'string' ? parseInt(limitParam, 10) : limitFallback,
      MIN_LIMIT
    ),
    MAX_LIMIT
  );
  const start = (page - 1) * limit;

  return { page, start, limit };
};
