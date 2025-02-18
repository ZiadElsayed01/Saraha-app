import Joi from "joi";

export const validationSchema = (schema) => {
  return (req, res, next) => {
    const schemaKeys = Object.keys(schema);

    const validationErrors = [];
    for (const key of schemaKeys) {
      const { error } = schema[key].validate(req[key], { abortEarly: false });
      if (error) {
        validationErrors.push(...error.details);
      }
    }

    if (validationErrors.length) {
      return res
        .status(400)
        .json({ message: "Validation Error", validationErrors });
    }

    next();
  };
};
