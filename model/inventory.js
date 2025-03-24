const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  productId: {
    type: String,
    ref: "Product",
    required: true,
  },
  startdate: {
    type: String,
    required: true,
  },
  enddate: {
    type: String,
    required: true,
  },
  price:{
    type:Number,
  },
  slot: {
    type: String, // e.g., "Slot 1", "Slot 2", "Slot 3"
    required: true,
  },
  reservedQty: {
    type: Number,
    default: 0,
  },
  availableQty: {
    type: Number,
    required: true,
  },
});

const Inventory = mongoose.model("Inventory", InventorySchema);
module.exports = Inventory;
