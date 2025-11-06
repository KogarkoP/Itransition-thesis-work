import Joi from "joi";

const itemSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().allow("").optional(),
  createdBy: Joi.string().required(),
});

export default itemSchema;
