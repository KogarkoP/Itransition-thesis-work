import Joi from "joi";

const inventorySettingsSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  category: Joi.string().required(),
});

export default inventorySettingsSchema;
