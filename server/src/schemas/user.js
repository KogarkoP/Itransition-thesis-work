import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  terms_privacy: Joi.boolean().valid(true).required(),
  password: Joi.string().pattern(/^\S+$/).required(),
});

export default userSchema;
