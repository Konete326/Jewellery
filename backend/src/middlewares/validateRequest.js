import { sendError } from '../utils/apiResponse.js';

export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      req.validated = parsed;
      next();
    } catch (error) {
      const formattedErrors = error.errors?.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      })) || [{ message: error.message }];

      return sendError(res, 400, 'Validation failed', formattedErrors);
    }
  };
};
