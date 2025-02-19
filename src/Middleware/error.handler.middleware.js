// Return HTML Error
export const errorHandler = (api) => {
  return (req, res, next) => {
    api(req, res, next).catch((error) => {
      console.log(`Error in ${req.url} from error handler middleware`, error);
      return next(new Error(error.message, { cause: 500 }));
    });
  };
};
// Convert HTML To JSON
export const globalErrorHandler = (req, res) => {
  console.log(`Global error handler ${err.message}`);
  return res
    .status(500)
    .json({ message: "Something went wrong", err: err.message });
};
