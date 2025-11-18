import Joi from "joi";

const userUpdateSchema = Joi.object({
  userOption: Joi.string().required(),
  userValue: Joi.alternatives().try(Joi.string(), Joi.boolean()).required(),
});

export default userUpdateSchema;
