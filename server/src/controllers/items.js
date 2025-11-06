import itemModel from "../models/items.js";
import { v4 as uuidv4 } from "uuid";

export const GET_All_ITEMS_BY_IDS = async (req, res) => {
  try {
    const itemsIds = req.body.ids;
    const items = await itemModel.find({ id: { $in: itemsIds } });
    res.status(200).json({
      items: items,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const INSERT_ITEM = async (req, res) => {
  try {
    const item = {
      id: uuidv4(),
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      createdBy: req.body.createdBy,
    };

    const addItem = new itemModel(item);
    const addedItem = await addItem.save();

    return res.status(201).json({
      item: addedItem,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const DELETE_ITEMS_BY_IDS = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "IDs array is required" });
    }

    const result = await itemModel.deleteMany({ id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No items found with the provided IDs" });
    }

    return res.status(200).json({
      message: `Deleted ${result.deletedCount} item(s)`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
