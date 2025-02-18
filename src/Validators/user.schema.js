import Joi from "joi";

export const updateProfileSchema = {
  body: Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  }).options({ presence: "required" }),
};

export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }).options({ presence: "required" }),
};
