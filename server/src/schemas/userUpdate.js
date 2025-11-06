import Joi from "joi";

const userUpdateSchema = Joi.object({
  userOption: Joi.string().required(),
  userValue: Joi.string().required(),
});

export default userUpdateSchema;
