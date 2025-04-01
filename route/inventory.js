const express = require("express");
const router = express.Router();
const inventoryController = require("../controller/inventory");

router.post("/createinventory", inventoryController.updateInventory);
router.get('/check-availability/:date',inventoryController.getInventoryByDate);
router.get("/filter", inventoryController.getInventoryByDateSlotProducts);
router.post("/get-by-slot-and-date", inventoryController.getinventorydataprroduct)



module.exports = router;
