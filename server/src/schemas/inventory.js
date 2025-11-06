import Joi from "joi";

const inventorySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  category: Joi.string().required(),
  createdBy: Joi.string().required(),
});

export default inventorySchema;
