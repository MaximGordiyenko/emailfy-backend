export const ApiError = ((status, message, errors = []) => ({
  status,
  message,
  errors,
}));

ApiError.Unauthorized = () => ApiError(401, 'Unauthorized');
ApiError.Conflict = (message, errors) => ApiError(409, message, errors);
ApiError.BadRequest = (message, errors) => ApiError(400, message, errors);
