import Joi from "joi";

export const signUpSchema = {
  body: Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    phone: Joi.string().required(),
  })
    .options({ presence: "required" })
    .with("password", "confirmPassword"),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).with("email", "password"),
};

export const verifyEmailSchema = {
  params: Joi.object({
    token: Joi.string().required(),
  }).options({ presence: "required" }),
};

export const refreshTokenSchema = {
  headers: Joi.object({
    refreshtoken: Joi.string().required(),
  })
    .unknown(true)
    .options({ presence: "required" }),
};

export const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }).options({ presence: "required" }),
};

export const resetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    OTP: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  }).options({ presence: "required" }),
};
