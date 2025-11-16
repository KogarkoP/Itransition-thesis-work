import inventoryModel from "../models/inventories.js";
import { v4 as uuidv4 } from "uuid";

export const GET_ALL_INVENTORIES = async (req, res) => {
  try {
    const inventories = await inventoryModel.find();
    res.status(200).json({
      inventories: inventories,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const GET_INVENTORY_BY_ID = async (req, res) => {
  try {
    const id = req.params.id;
    const inventory = await inventoryModel.findOne({ id: id });

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory does not exist",
      });
    }

    return res.status(200).json({
      message: "Here is your inventory",
      inventory: inventory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const GET_USER_INVENTORIES = async (req, res) => {
  try {
    const id = req.params.id;
    const inventories = await inventoryModel.find({ createdBy: id });

    return res.status(200).json({
      message: "Here are your inventories",
      inventories: inventories,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const INSERT_INVENTORY = async (req, res) => {
  try {
    const inventory = {
      id: uuidv4(),
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      createdBy: req.body.createdBy,
    };

    const addInventory = new inventoryModel(inventory);
    const addedInventory = await addInventory.save();

    res.status(201).json({
      inventory: addedInventory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const UPDATE_INVENTORY_BY_ID = async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const itemsIds = req.body.itemsIds;
    const userOption = req.body.userOption;

    if (!inventoryId) {
      return res.status(404).json({
        message: "Inventory id is not provided",
      });
    }

    let updateQuery;

    if (userOption === "pull") {
      updateQuery = { $pull: { items: { $in: itemsIds } } };
    } else if (userOption === "push") {
      updateQuery = { $push: { items: { $each: itemsIds } } };
    } else {
      return res.status(400).json({ message: "Invalid userOption provided" });
    }

    const updatedInventory = await inventoryModel.findOneAndUpdate(
      { id: inventoryId },
      updateQuery,
      { new: true }
    );

    if (!updatedInventory) {
      return res.status(404).json({
        message: "Inventory does not exist",
      });
    }

    return res.status(200).json({
      message: "Inventory updated successfully",
      inventory: updatedInventory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const UPDATE_INVENTORY_SETTINGS_BY_ID = async (req, res) => {
  const inventoryId = req.params.id;
  const title = req.body.title;
  const description = req.body.description;
  const category = req.body.category;

  if (!inventoryId) {
    return res.status(404).json({
      message: "Inventory id is not provided",
    });
  }

  const updatedInventorySettings = await inventoryModel.findOneAndUpdate(
    { id: inventoryId },
    { $set: { title: title, description: description, category: category } },
    { new: true }
  );

  if (!updatedInventorySettings) {
    return res.status(404).json({
      message: "Inventory does not exist",
    });
  }

  return res.status(200).json({
    message: "Inventory updated successfully",
    inventory: updatedInventorySettings,
  });
};

export const DELETE_INVENTORIES_BY_IDS = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "IDs array is required" });
    }

    const result = await inventoryModel.deleteMany({ id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No inventories found with the provided IDs" });
    }

    return res.status(200).json({
      message: `Deleted ${result.deletedCount} inventories`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
