const ordermodel = require("../model/order");
const ProductManagementModel = require("../model/product");
const InventoryModel = require("../model/inventory");
const mongoose = require("mongoose");

class order {
  //   async  postaddorder(req, res) {
  //     const {
  //       ClientId,
  //       products,
  //       slots,
  //       GrandTotal,
  //       paymentStatus,
  //       orderStatus,
  //       clientName,
  //       executivename,
  //       clientNo,
  //       Address,
  //       labourecharge,
  //       transportcharge,
  //       discount,
  //       GST,
  //     } = req.body;

  // console.log( ClientId,
  //   products,
  //   GrandTotal,
  //   paymentStatus,
  //   orderStatus,
  //   clientName,
  //   executivename,
  //   clientNo,
  //   Address,
  //   labourecharge,
  //   transportcharge,
  //   discount,
  //   slots,
  //   GST,)

  //     try {
  //       const newOrder = new ordermodel({
  //         ClientId,
  //         products,
  //         GrandTotal,
  //         paymentStatus,
  //         orderStatus,
  //         clientName,
  //         executivename,
  //         clientNo,
  //         Address,
  //         labourecharge,
  //         transportcharge,
  //         discount,
  //         GST,
  //         slots,
  //       });

  //       await newOrder.save();

  //       res.status(200).json({
  //         success: "Order placed successfully, and stock reserved.",
  //         order: newOrder,
  //       });
  //     } catch (error) {
  //       console.error("Error placing order:", error);
  //       res.status(500).json({ error: "Failed to place order and reserve stock." });
  //     }
  //   }

  // async postaddorder (req, res)  {
  //   const { slots, ClientId, clientName, clientNo, executivename, Address, GrandTotal,paymentStatus,orderStatus,labourecharge,transportcharge ,GST,discount} = req.body;

  //   try {
  //     // Iterate through slots
  //     for (const slot of slots) {
  //       const { products, quoteDate, endDate, slotName } = slot;

  //       // Convert quoteDate and endDate to Date objects
  //       const startDate = new Date(quoteDate);
  //       const finalDate = new Date(endDate);

  //       for (const product of products) {
  //         const { productId, quantity, productName } = product;

  //         // Loop through each day in the slot date range
  //         for (let date = new Date(startDate); date <= finalDate; date.setDate(date.getDate() + 1)) {
  //           const formattedDate = new Date(date.toISOString().split("T")[0]);

  //           let inventory = await InventoryModel.findOne({ productId, date: formattedDate });

  //           // Fetch product stock if inventory entry does not exist
  //           const globalStock = inventory
  //             ? inventory.availableQty
  //             : (await ProductManagementModel.findById(productId)).ProductStock;

  //           // Check stock availability
  //           if (globalStock < quantity) {
  //             return res.status(400).json({
  //               message: `Product "${productName}" has insufficient stock for the date: ${formattedDate.toISOString().split("T")[0]}.`,
  //             });
  //           }

  //           // Reserve stock for the slot
  //           if (inventory) {
  //             inventory.reservedQty += quantity;
  //             inventory.availableQty -= quantity;
  //           } else {
  //             inventory = new InventoryModel({
  //               productId,
  //               date: formattedDate,
  //               reservedQty: quantity,
  //               availableQty: globalStock - quantity,
  //             });
  //           }

  //           await inventory.save();
  //         }

  //         // Update global product stock
  //         const productData = await ProductManagementModel.findById(productId);
  //         productData.ProductStock -= quantity;
  //         productData.StockSold += quantity;
  //         await productData.save();
  //       }
  //     }

  //     // Create the order after inventory is successfully updated
  //     const newOrder = new ordermodel({
  //       ClientId,
  //       clientName,
  //       clientNo,
  //       executivename,
  //       slots,
  //       Address,
  //       GrandTotal,
  //       paymentStatus,orderStatus,labourecharge,transportcharge ,GST,discount
  //     });

  //     const savedOrder = await newOrder.save();

  //     res.status(201).json({
  //       message: "Order created successfully, and inventory updated.",
  //       order: savedOrder,
  //     });
  //   } catch (error) {
  //     console.error("Error creating order:", error);
  //     res.status(500).json({ message: "Failed to create order and update inventory.", error: error.message });
  //   }
  // };

  // +++++
  async postaddorder(req, res) {
    const {
      slots,
      ClientId,
      clientName,
      clientNo,
      executivename,
      Address,
      GrandTotal,
      paymentStatus,
      orderStatus,
      labourecharge,
      transportcharge,
      GST,
      discount,
      placeaddress,
      adjustments,
      products,
    } = req.body;

    try {
      // Iterate through slots
      for (const slot of slots) {
        const { products, quoteDate, endDate, slotName } = slot;

        // Convert quoteDate and endDate to Date objects
        const startDate = quoteDate;
        const finalDate = endDate;

        // Validate date range
        // if (isNaN(startDate.getTime()) || isNaN(finalDate.getTime())) {
        //   return res.status(400).json({ message: "Invalid quoteDate or endDate provided." });
        // }

        for (const product of products) {
          const { productId, quantity, productName } = product;

          // Validate product fields
          if (!productId || !quantity || quantity <= 0) {
            return res
              .status(400)
              .json({
                message: `Invalid product details for "${productName}".`,
              });
          }

          // Loop through each day in the slot date range
          for (
            let date = new Date(startDate);
            date <= finalDate;
            date.setDate(date.getDate() + 1)
          ) {
            const formattedDate = new Date(date.toISOString().split("T")[0]);

            // Fetch inventory for the specific product and date
            let inventory = await InventoryModel.findOne({
              productId,
              date: formattedDate,
            });

            // Fetch product stock if inventory entry does not exist
            const globalStock = inventory
              ? inventory.availableQty
              : (await ProductManagementModel.findById(productId)).ProductStock;

            // Check stock availability
            if (globalStock < quantity) {
              return res.status(400).json({
                message: `Insufficient stock for "${productName}" on ${
                  formattedDate.toISOString().split("T")[0]
                }.`,
              });
            }

            // Update or create inventory entry
            if (inventory) {
              inventory.reservedQty += quantity;
              inventory.availableQty -= quantity;
            } else {
              inventory = new InventoryModel({
                productId,
                date: formattedDate,
                reservedQty: quantity,
                availableQty: globalStock - quantity,
              });
            }

            // Save inventory updates
            await inventory.save();
          }

          // Update global product stock
          // const productData = await ProductManagementModel.findById(productId);
          // if (!productData) {
          //   return res.status(404).json({ message: `Product with ID "${productId}" not found.` });
          // }
          // productData.ProductStock -= quantity;
          // productData.StockSold += quantity;
          // await productData.save();
        }
      }

      // Create the order after inventory updates
      const newOrder = new ordermodel({
        ClientId,
        clientName,
        clientNo,
        executivename,
        slots,
        Address,
        GrandTotal,
        paymentStatus,
        orderStatus,
        labourecharge,
        transportcharge,
        GST,
        discount,
        placeaddress,
        adjustments,
        products,
      });

      const savedOrder = await newOrder.save();

      res.status(201).json({
        message: "Order created successfully and inventory updated.",
        order: savedOrder,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({
        message: "Failed to create order and update inventory.",
        error: error.message,
      });
    }
  }

  async getTotalNumberOfOrder(req, res) {
    try {
      // Get the current date and set the time to the start of the day
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Get the current date and set the time to the end of the day
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Count the total number of documents
      let totalorderCount = await ordermodel.countDocuments({});

      // Count the number of documents created today
      let todayorderCount = await ordermodel.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      return res.json({
        totalorderCount: totalorderCount,
        todayorderCount: todayorderCount,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve quotation counts" });
    }
  }

  async getallorders(req, res) {
    try {
      let data = await ordermodel.find({}).sort({ _id: -1 });
      // console.log(data,"Data nhi")
      if (data) {
        return res.json({ orderData: data });
      } else {
        return res.status(404).json({ error: "No orders found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to retrieve orders" });
    }
  }

  async findanddelete(req, res) {
    try {
      let data = await ordermodel.find({ phone });
    } catch (error) {
      return res.status(500).json({ error: "Failed to retrieve " });
    }
  }

  async getfindwithClientID(req, res) {
    try {
      const id = req.params.id;
      let data = await ordermodel.find({ ClientId: id }).sort({ _id: -1 });
      if (data) {
        return res.json({ orderData: data });
      } else {
        return res.status(404).json({ error: "No orders found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to retrieve orders" });
    }
  }

  async getApprovedOrders(req, res) {
    try {
      const data = await ordermodel
        .find({ orderStatus: { $in: ["Approved", "Delivered", "Returned"] } })
        .sort({ _id: -1 });

      if (data.length > 0) {
        return res.json({ orderData: data });
      } else {
        return res.status(404).json({ error: "No orders found" });
      }
    } catch (error) {
      console.error("Error retrieving orders:", error); // Log the error for debugging
      return res.status(500).json({ error: "Failed to retrieve orders" });
    }
  }

  async updateStatus(req, res) {
    try {
      const id = req.params.id; // Extract the order ID from the URL
      const { orderStatus } = req.body; // Extract orderStatus from the request body

      // Log received data for debugging
      console.log("Order ID:", id);
      console.log("New Order Status:", orderStatus);

      if (!id) {
        return res.status(400).json({ error: "Order ID is required" });
      }

      if (!orderStatus) {
        return res.status(400).json({ error: "Order status is required" });
      }

      // Perform the update operation
      const orderDetails = await ordermodel.findOneAndUpdate(
        { _id: id }, // Query condition: Match by ID
        { orderStatus }, // Update operation: Set new status
        { new: true } // Return the updated document
      );

      if (orderDetails) {
        return res.status(200).json({
          success: true,
          message: "Order status updated successfully",
          orderDetails,
        });
      } else {
        return res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      console.error("Error in updateStatus:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async refurbishment(req, res) {
    try {
      const { id } = req.params;
      const {
        productrefurbishment,
        damagerefurbishment,
        shippingaddressrefurbishment,
        expense,
        floormanager,
      } = req.body;
      const existingRefurbishment = await ordermodel.findById(id);
      if (!existingRefurbishment) {
        return res.status(404).json({ message: "Refurbishment not found" });
      }
      const updatedData = {
        productrefurbishment:
          productrefurbishment || existingRefurbishment.productrefurbishment,
        damagerefurbishment:
          damagerefurbishment || existingRefurbishment.damagerefurbishment,
        shippingaddressrefurbishment:
          shippingaddressrefurbishment ||
          existingRefurbishment.shippingaddressrefurbishment,
        expense: expense || existingRefurbishment.expense,
        floormanager: floormanager || existingRefurbishment.floormanager,
      };
      const updatedRefurbishment = await ordermodel.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );
      if (!updatedRefurbishment) {
        return res.status(404).json({ message: "Refurbishment not found" });
      }
      return res.status(200).json({
        message: "Refurbishment updated successfully",
        data: updatedRefurbishment,
      });
    } catch (error) {
      console.error("Error updating refurbishment:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // product sales
  async getHighestAndLowestProductSales(req, res) {
    try {
      const productSales = await ProductManagementModel.aggregate([
        {
          $lookup: {
            from: "orders", // Join with the orders collection
            localField: "_id", // Match Product _id
            foreignField: "products.productId", // Match productId in orders
            as: "orderDetails",
          },
        },
        {
          $unwind: {
            path: "$orderDetails",
            preserveNullAndEmptyArrays: true, // Include products with no orders
          },
        },
        {
          $unwind: {
            path: "$orderDetails.products",
            preserveNullAndEmptyArrays: true, // Include products with no matching sales
          },
        },
        {
          $match: {
            $expr: { $eq: ["$orderDetails.products.productId", "$_id"] }, // Match product IDs
          },
        },
        {
          $group: {
            _id: "$_id", // Group by ProductId
            productName: { $first: "$ProductName" }, // Product name from the product collection
            totalSales: {
              $sum: {
                $cond: [
                  { $ifNull: ["$orderDetails.products.quantity", false] }, // Check if quantity exists
                  "$orderDetails.products.quantity", // Sum quantities
                  0, // If no sales, set to 0
                ],
              },
            },
          },
        },
        { $sort: { totalSales: -1 } }, // Sort by total sales descending
        { $limit: 5 }, // Limit to top 5 products
      ]);

      res.status(200).json({
        success: true,
        topProducts: productSales,
      });
    } catch (error) {
      console.error("Error calculating product sales:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // async getHighestAndLowestProductSales(req, res) {
  //   try {
  //     const productSales = await ProductManagementModel.aggregate([
  //       {
  //         $lookup: {
  //           from: "orders", // Join with the orders collection
  //           localField: "_id", // Match ProductId in products
  //           foreignField: "products.ProductId", // Match ProductId in orders
  //           as: "orderDetails",
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$orderDetails",
  //           preserveNullAndEmptyArrays: true, // Include products with no orders
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$orderDetails.products",
  //           preserveNullAndEmptyArrays: true, // Include products with no matching sales
  //         },
  //       },
  //       {
  //         $match: {
  //           $expr: { $eq: ["$orderDetails.products.ProductId", "$_id"] }, // Match product IDs
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: "$_id", // Group by ProductId
  //           productName: { $first: "$ProductName" }, // Product name from the product collection
  //           totalSales: {
  //             $sum: {
  //               $cond: [
  //                 { $ifNull: ["$orderDetails.products.qty", false] },
  //                 "$orderDetails.products.qty",
  //                 0, // If no sales, set to 0
  //               ],
  //             },
  //           },
  //         },
  //       },
  //       { $sort: { totalSales: -1 } }, // Sort by total sales descending
  //       { $limit: 5 }, // Limit to top 5 products
  //     ]);

  //     res.status(200).json({
  //       success: true,
  //       topProducts: productSales,
  //     });
  //   } catch (error) {
  //     console.error("Error calculating product sales:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }

  // category sales

  async getCategorySales(req, res) {
    try {
      const categorySales = await ProductManagementModel.aggregate([
        {
          $lookup: {
            from: "orders", // Join with orders collection
            localField: "_id", // Match Product _id
            foreignField: "products.productId", // Match productId in orders
            as: "orderDetails",
          },
        },
        {
          $unwind: {
            path: "$orderDetails",
            preserveNullAndEmptyArrays: true, // Include products with no orders
          },
        },
        {
          $unwind: {
            path: "$orderDetails.products",
            preserveNullAndEmptyArrays: true, // Include products with no matching sales
          },
        },
        {
          $match: {
            $expr: { $eq: ["$orderDetails.products.productId", "$_id"] }, // Match product IDs
          },
        },
        {
          $group: {
            _id: "$ProductCategory", // Group by ProductCategory
            totalSales: {
              $sum: {
                $cond: [
                  { $ifNull: ["$orderDetails.products.quantity", false] }, // Check if quantity exists
                  "$orderDetails.products.quantity", // Sum quantities
                  0, // If no quantity, add 0
                ],
              },
            },
          },
        },
        { $sort: { totalSales: -1 } }, // Sort categories by total sales descending
        {
          $project: {
            categoryName: "$_id", // Rename _id to categoryName
            totalSales: 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        categorySales,
      });
    } catch (error) {
      console.error("Error calculating category sales:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // async getCategorySales(req, res) {
  //   try {
  //     const categorySales = await ProductManagementModel.aggregate([
  //       {
  //         $lookup: {
  //           from: "orders", // Join with orders collection
  //           localField: "_id", // Match ProductId in products collection
  //           foreignField: "products.ProductId", // Match ProductId in orders
  //           as: "orderDetails",
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$orderDetails",
  //           preserveNullAndEmptyArrays: true, // Include products with no orders
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$orderDetails.products",
  //           preserveNullAndEmptyArrays: true, // Include products with no matching sales
  //         },
  //       },
  //       {
  //         $match: {
  //           $expr: { $eq: ["$orderDetails.products.ProductId", "$_id"] }, // Match product IDs
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: "$ProductCategory", // Group by ProductCategory
  //           totalSales: {
  //             $sum: {
  //               $cond: [
  //                 { $ifNull: ["$orderDetails.products.qty", false] },
  //                 "$orderDetails.products.qty",
  //                 0, // If no sales, set to 0
  //               ],
  //             },
  //           },
  //         },
  //       },
  //       { $sort: { totalSales: -1 } }, // Sort categories by total sales descending
  //       {
  //         $project: {
  //           categoryName: "$_id", // Rename _id to categoryName
  //           totalSales: 1,
  //         },
  //       },
  //     ]);

  //     res.status(200).json({
  //       success: true,
  //       categorySales,
  //     });
  //   } catch (error) {
  //     console.error("Error calculating category sales:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }

  async getHighestAndLowestProductSalesdate(req, res) {
    try {
      const { fromDate, toDate } = req.query;

      // Ensure `fromDate` and `toDate` are provided
      if (!fromDate || !toDate) {
        return res
          .status(400)
          .json({ error: "fromDate and toDate are required" });
      }

      const productSales = await ProductManagementModel.aggregate([
        {
          $lookup: {
            from: "orders", // Join with the orders collection
            localField: "_id", // Match ProductId in products
            foreignField: "products.ProductId", // Match ProductId in orders
            as: "orderDetails",
          },
        },
        {
          $unwind: {
            path: "$orderDetails",
            preserveNullAndEmptyArrays: true, // Include products with no orders
          },
        },
        {
          $unwind: {
            path: "$orderDetails.products",
            preserveNullAndEmptyArrays: true, // Include products with no matching sales
          },
        },
        {
          $match: {
            $and: [
              { $expr: { $eq: ["$orderDetails.products.ProductId", "$_id"] } }, // Match product IDs
              {
                $expr: {
                  $and: [
                    { $gte: ["$orderDetails.startDate", new Date(fromDate)] }, // Filter by fromDate
                    { $lte: ["$orderDetails.startDate", new Date(toDate)] }, // Filter by toDate
                  ],
                },
              },
            ],
          },
        },
        {
          $group: {
            _id: "$_id", // Group by ProductId
            productName: { $first: "$ProductName" }, // Product name from the product collection
            totalSales: {
              $sum: {
                $cond: [
                  { $ifNull: ["$orderDetails.products.qty", false] },
                  "$orderDetails.products.qty",
                  0, // If no sales, set to 0
                ],
              },
            },
          },
        },
        { $sort: { totalSales: -1 } }, // Sort by total sales descending
        { $limit: 5 }, // Limit to top 5 products
      ]);

      res.status(200).json({
        success: true,
        topProducts: productSales,
      });
    } catch (error) {
      console.error("Error calculating product sales:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async getProductSalesData(req, res) {
    try {
      const { productId } = req.params;
      console.log("ProductId received:", productId);

      // Validate productId format
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Invalid ProductId format" });
      }

      // Convert productId to ObjectId
      const ObjectId = mongoose.Types.ObjectId;
      const productObjectId = new ObjectId(productId);

      const productSales = await ordermodel.aggregate([
        {
          $unwind: {
            path: "$products", // Decompose products array
            preserveNullAndEmptyArrays: true, // Prevent removal of orders with no products
          },
        },
        {
          $match: {
            "products.productId": productObjectId, // Match the productId field
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } }, // Group by startDate
            totalSales: { $sum: "$products.quantity" }, // Sum quantities sold
          },
        },
        { $sort: { _id: 1 } }, // Sort by date in ascending order
      ]);

      // Format data for response
      const formattedData = productSales.map((item) => ({
        date: item._id,
        totalSales: item.totalSales,
      }));

      res.status(200).json({
        success: true,
        data: formattedData,
      });
    } catch (error) {
      console.error("Error fetching product sales data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // async getProductSalesData(req, res) {
  //   try {
  //     const { productId } = req.params;
  //     console.log("ProductId received:", productId);

  //     // Validate productId format
  //     if (!mongoose.Types.ObjectId.isValid(productId)) {
  //       return res.status(400).json({ error: "Invalid ProductId format" });
  //     }

  //     // Convert productId to ObjectId
  //     const ObjectId = mongoose.Types.ObjectId;

  //     const productObjectId =new ObjectId(productId);

  //     const productSales = await ordermodel.aggregate([
  //       {
  //         $unwind: "$products", // Decompose products array
  //       },
  //       {
  //         $match: {
  //           "products.ProductId": productObjectId, // Match the productId
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } }, // Group by date
  //           totalSales: { $sum: "$products.qty" }, // Sum quantities sold
  //         },
  //       },
  //       { $sort: { _id: 1 } }, // Sort by date
  //     ]);

  //     const formattedData = productSales.map((item) => ({
  //       date: item._id,
  //       totalSales: item.totalSales,
  //     }));

  //     res.status(200).json({
  //       success: true,
  //       data: formattedData,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching product sales data:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }

  // async getHighestAndLowestProductSales(req, res) {
  //   try {
  //     const productSales = await ProductManagementModel.aggregate([
  //       {
  //         $lookup: {
  //           from: "orders", // Join with the orders collection
  //           localField: "_id", // Match ProductId in products
  //           foreignField: "products.ProductId", // Match ProductId in orders
  //           as: "orderDetails",
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$orderDetails",
  //           preserveNullAndEmptyArrays: true, // Include products with no orders
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$orderDetails.products",
  //           preserveNullAndEmptyArrays: true, // Include products with no matching sales
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: "$_id", // Group by ProductId
  //           productName: { $first: "$ProductName" }, // Product name from the product collection
  //           totalSales: {
  //             $sum: {
  //               $cond: [
  //                 { $ifNull: ["$orderDetails.products.qty", false] },
  //                 "$orderDetails.products.qty",
  //                 0, // If no sales, set to 0
  //               ],
  //             },
  //           },
  //         },
  //       },
  //       { $sort: { totalSales: -1 } }, // Sort by total sales descending
  //       { $limit: 5 }, // Limit to top 5 products
  //     ]);

  //     res.status(200).json({
  //       success: true,
  //       topProducts: productSales,
  //     });
  //   } catch (error) {
  //     console.error("Error calculating product sales:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }

  // async getHighestAndLowestProductSales(req, res) {
  //   try {
  //     const productSales = await ProductManagementModel.aggregate([
  //       {
  //         $lookup: {
  //           from: "orders", // Collection name for orders
  //           localField: "_id", // ProductId in the product collection
  //           foreignField: "products.ProductId", // ProductId in the orders collection
  //           as: "orderDetails",
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$orderDetails",
  //           preserveNullAndEmptyArrays: true, // Include products with no sales
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$orderDetails.products",
  //           preserveNullAndEmptyArrays: true, // Include products with no sales
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: "$_id", // Group by ProductId
  //           productName: { $first: "$ProductName" }, // Product name from the product collection
  //           totalSales: {
  //             $sum: {
  //               $cond: [
  //                 { $ifNull: ["$orderDetails.products.qty", false] },
  //                 "$orderDetails.products.qty",
  //                 0, // If no sales, set to 0
  //               ],
  //             },
  //           },
  //         },
  //       },
  //       { $sort: { totalSales: -1 } }, // Sort by total sales descending
  //       { $limit: 5 }, // Limit to top 5 products
  //     ]);

  //     res.status(200).json({
  //       success: true,
  //       topProducts: productSales,
  //     });
  //   } catch (error) {
  //     console.error("Error calculating product sales:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }

  // async getHighestAndLowestProductSales(req, res) {
  //   try {
  //     const productSales = await ordermodel.aggregate([
  //       { $unwind: "$products" }, // Decompose products array into individual documents
  //       {
  //         $group: {
  //           _id: "$products.ProductId", // Group by ProductId
  //           totalSales: { $sum: "$products.qty" }, // Sum the quantity sold
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "products", // Collection name for products
  //           localField: "_id", // ProductId from the orders
  //           foreignField: "_id", // _id in the products collection
  //           as: "productDetails",
  //         },
  //       },
  //       { $unwind: "$productDetails" }, // Unwind product details
  //       {
  //         $project: {
  //           productName: "$productDetails.ProductName",
  //           totalSales: 1,
  //         },
  //       },
  //       { $sort: { totalSales: -1 } }, // Sort by total sales descending

  //       { $limit: 5 },
  //     ]);

  //     const highestSale = productSales[0] || null;
  //     const lowestSale = productSales[productSales.length - 1] || null;

  //     res.status(200).json({
  //       success: true,
  //       highestSale,
  //       lowestSale,
  //     });
  //   } catch (error) {
  //     console.error("Error calculating product sales:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }
}

const orderController = new order();
module.exports = orderController;
