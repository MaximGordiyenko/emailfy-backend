export const ErrorMiddleware = (err, req, res, next) => {
  if (err !== undefined && err !== null) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Unexpected server error' });
};
