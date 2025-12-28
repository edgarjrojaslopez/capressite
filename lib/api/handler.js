// /lib/api/handler.js
import { ApiError, handleError } from './error';

function withErrorHandler(handler) {
  return async function (req) {
    try {
      return await handler(req);
    } catch (error) {
      return handleError(error);
    }
  };
}

export { withErrorHandler, ApiError };
