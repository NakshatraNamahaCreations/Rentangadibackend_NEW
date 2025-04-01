const InventoryModel = require("../model/inventory");
const ProductManagementModel = require("../model/product");

class Inventory {
  async updateInventory(req, res) {
    const { startDate, endDate, products } = req.body;

    console.log("products", products);

    // Parse the start and end dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
      // Iterate through each product
      for (const product of products) {
        const { ProductId, qty } = product;

        // Find the product in the product management model
        const pData = await ProductManagementModel.findById(ProductId);

        // Handle the case where the product does not exist
        if (!pData) {
          return res
            .status(404)
            .json({ error: `Product with ID ${ProductId} not found` });
        }

        // Iterate over the date range and create or update an entry for each day
        for (
          let dt = new Date(start);
          dt <= end;
          dt.setDate(dt.getDate() + 1)
        ) {
          const dateKey = new Date(dt);

          // Find an existing inventory entry for the product and date
          const existingEntry = await InventoryModel.findOne({
            productId: ProductId,
            startDate: dateKey,
          });

          if (existingEntry) {
            // Update the quantity and remaining quantity of the existing entry
            existingEntry.qty += qty;
            existingEntry.remainingQty += qty; // Assuming remainingQty should also increase
            await existingEntry.save();
          } else {
            // Calculate remaining quantity based on the product's total stock
            const remainingQty = pData.ProductStock - qty;

            // Create a new inventory entry
            const newOrder = new InventoryModel({
              productId: ProductId,
              startDate: dateKey,
              endDate: dateKey, // Optional, could be omitted or set to dateKey
              qty: qty,
              remainingQty: remainingQty >= 0 ? remainingQty : 0, // Ensure non-negative remaining quantity
            });

            await newOrder.save();
          }
        }
      }

      res.json({
        success: "Inventory updated successfully for each day in range",
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ error: "Failed to update inventory" });
    }
  }

  
  async getInventoryByDate  (req, res) {
    const { date } = req.query;
  
    try {
      const inventory = await InventoryModel.find({ date: new Date(date) });
  
      const products = await ProductManagementModel.find().lean();
  
      const stock = products.map((product) => {
        const inventoryEntry = inventory.find(
          (item) => item.productId.toString() === product._id.toString()
        );
  
        return {
          productId: product._id,
          productName: product.ProductName,
          totalStock: product.ProductStock,
          availableStock: inventoryEntry
            ? inventoryEntry.availableQty
            : product.ProductStock,
        };
      });
  
      res.status(200).json({ stock });
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory.", error: error.message });
    }
  };
  
  // async  getInventoryByDateSlotProduct(req, res) {
  //   const { startDate, endDate, productId, slot } = req.query;
  
  //   try {
  //     // Validate required parameters
  //     if (!startDate || !endDate || !slot) {
  //       return res.status(400).json({ message: "Start date, end date, and slot are required." });
  //     }
  
  //     // Fetch inventory based on the provided filters
  //     // const inventory = await InventoryModel.find({
  //     //   startdate: { $gte: startDate },
  //     //   enddate: { $lte: endDate },
  //     //   slot: slot,
  //     //   ...(productId && { productId }) // Apply productId filter only if provided
  //     // });

  //     const inventory = await InventoryModel.find({
  //       startdate: { $gte: startDate.trim() },
  //       enddate: { $lte: endDate.trim() },
  //       slot: slot.trim().toLowerCase(), // Convert slot to lowercase
  //       productId: productId.trim()
  //     });
      
  
  //     // Fetch product details
  //     const products = await ProductManagementModel.find().lean();
  
  //     // Map inventory details with products
  //     const stock = products.map((product) => {
  //       const inventoryEntries = inventory.filter(
  //         (item) => item.productId.toString() === product._id.toString()
  //       );
  
  //       const reservedStock = inventoryEntries.reduce((sum, item) => sum + item.reservedQty, 0);
  //       const availableStock = Math.max(product.ProductStock - reservedStock, 0);
  
  //       return {
  //         productId: product._id,
  //         productName: product.ProductName,
  //         totalStock: product.ProductStock,
  //         reservedStock: reservedStock,
  //         availableStock: availableStock,
  //         slot: slot,
  //       };
  //     });
  
  //     res.status(200).json({ stock });
  //   } catch (error) {
  //     console.error("Error fetching inventory:", error);
  //     res.status(500).json({ message: "Failed to fetch inventory.", error: error.message });
  //   }
  // }
  async  getInventoryByDateSlotProducts(req, res) {
    const { startDate, endDate, slot, products } = req.query;
  
    try {
      if (!startDate || !endDate || !slot || !products) {
        return res.status(400).json({ message: "Start date, end date, slot, and product IDs are required." });
      }
  
      // Convert products string to an array (if coming from query parameters)
      const productIds = Array.isArray(products) ? products : products.split(",");
  
      // Fetch inventory for the given date range, slot, and product IDs
      const inventory = await InventoryModel.find({
        startdate: { $lte: endDate.trim() }, // Include all inventory that started before or on endDate
        enddate: { $gte: startDate.trim() }, // Include all inventory that ends after or on startDate
        slot: slot.trim(),
        productId: { $in: productIds }, // Match multiple product IDs
      });
  
      // Fetch product details
      const productsData = await ProductManagementModel.find({ _id: { $in: productIds } }).lean();
  
      // Map inventory details with products
      const stock = productsData.map((product) => {
        const inventoryEntries = inventory.filter(
          (item) => item.productId.toString() === product._id.toString()
        );
  
        // Calculate total reserved and available stock for this product across matching inventory entries
        const totalReserved = inventoryEntries.reduce((sum, item) => sum + item.reservedQty, 0);

        // Get the lowest availableQty value for this product in the given slot
        const minAvailableQty = inventoryEntries.length > 0 
          ? Math.min(...inventoryEntries.map((item) => item.availableQty)) 
          : product.ProductStock;
        return {
          productId: product._id,
          productName: product.ProductName,
          totalStock: product.ProductStock,
          reservedStock: totalReserved,
          availableStock: Math.max(minAvailableQty, 0), // Ensure available stock never goes negative
          slot: slot,
          price: product.ProductPrice || 0,
          StockAvailable:product.StockAvailable
        };

      });
  
      res.status(200).json({ stock });
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory.", error: error.message });
    }
  }

  async getinventorydataprroduct(req, res) {
    const { slot, startdate, enddate } = req.body;
    console.log(slot, startdate, enddate, "Request Data");
  
    try {
      const inventory = await InventoryModel.find({
        slot: slot, 
        startdate: startdate, 
        enddate: enddate, 
      }).populate("productId", "ProductName");
  
      if (!inventory) {
        return res.status(404).json({ error: "No inventory found" });
      }
  
      res.status(200).json({ inventory });
    } catch (error) {
      console.error("Error fetching inventory by slot/date:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  
  
  
}

const inventoryController = new Inventory();
module.exports = inventoryController;
