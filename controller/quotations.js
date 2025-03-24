const mongoose = require("mongoose");
const Quotationmodel = require("../model/quotations");
const NodeCache = require("node-cache");
const ProductModel = require("../model/product");
const InventoryModel = require("../model/inventory");
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
const moment = require("moment");

class Quotations {
  // async createQuotations(req, res) {
  //     const session = await mongoose.startSession();
  //     session.startTransaction();

  //     try {
  //         const {
  //             clientId,
  //             quoteDate,
  //             endDate,
  //             quoteTime,
  //             clientName,
  //             clientNo,
  //             address,
  //             Products,
  //             category,
  //             status,
  //             GrandTotal,
  //             adjustments,
  //             discount,
  //             termsandCondition,
  //             GST,
  //             executivename,
  //             placeaddress,
  //             slots,
  //         } = req.body;

  //         // Generate the next quotation ID
  //         const latestQuotation = await Quotationmodel.findOne()
  //             .sort({ _id: -1 })
  //             .session(session);
  //         const nextQuoteId = latestQuotation
  //             ? `QT${(parseInt(latestQuotation.quoteId.replace("QT", ""), 10) + 1)
  //                 .toString()
  //                 .padStart(4, "0")}`
  //             : "QT0001";

  //         // Create the new quotation
  //         const newQuotation = new Quotationmodel({
  //             clientId,
  //             quoteId: nextQuoteId,
  //             clientName,
  //             Products,
  //             clientNo,
  //             address,
  //             category,
  //             quoteDate,
  //             quoteTime,
  //             termsandCondition,
  //             GrandTotal,
  //             adjustments,
  //             discount,
  //             GST,
  //             status,
  //             executivename,
  //             endDate,
  //             placeaddress,
  //             slots,
  //         });

  //         const savedQuotation = await newQuotation.save({ session });

  //         // Update inventory for slots and products
  //         for (const slot of slots) {
  //             const { Products, slotName } = slot;

  //             for (const product of Products) {
  //                 const { productId, quantity, StockAvailable } = product;

  //                 // Fetch overlapping reservations for the requested date range and slot
  //                 const overlappingReservations = await InventoryModel.find({
  //                     productId,
  //                     $or: [
  //                         {
  //                             startdate: { $lte: endDate },
  //                             enddate: { $gte: quoteDate },
  //                         },
  //                     ],
  //                     slot: slotName,
  //                 }).session(session);

  //                 // Calculate total reserved inventory during the requested slot
  //                 let totalReservedQty = overlappingReservations.reduce(
  //                     (sum, reservation) => sum + reservation.reservedQty,
  //                     0
  //                 );

  //                 // Calculate available stock based on reservations
  //                 const availableStock = StockAvailable - totalReservedQty;

  //                 if (availableStock < quantity) {
  //                     throw new Error(
  //                         `Insufficient stock for product: ${product.productName} in slot: ${slotName}. Only ${availableStock} available due to overlapping reservations.`
  //                     );
  //                 }

  //                 // Update or create inventory for the current slot
  //                 const existingInventory = await InventoryModel.findOne({
  //                     productId,
  //                     startdate: quoteDate,
  //                     enddate: endDate,
  //                     slot: slotName,
  //                 }).session(session);

  //                 if (existingInventory) {
  //                     existingInventory.reservedQty += quantity;
  //                     existingInventory.availableQty = availableStock - quantity;
  //                     await existingInventory.save({ session });
  //                 } else {
  //                     const newInventory = new InventoryModel({
  //                         productId,
  //                         startdate: quoteDate,
  //                         enddate: endDate,
  //                         slot: slotName,
  //                         reservedQty: quantity,
  //                         availableQty: availableStock - quantity,
  //                     });

  //                     await newInventory.save({ session });
  //                 }
  //             }
  //         }

  //    // Commit the transaction
  //    await session.commitTransaction();
  //    session.endSession();

  //    return res.json({ success: "Quotation created and inventory updated successfully" });
  // } catch (error) {
  //    // Abort the transaction in case of an error
  //    await session.abortTransaction();
  //    session.endSession();
  //    console.error("Error creating quotation:", error);
  //    return res.status(500).json({ error: error.message || "Failed to create Quotation" });
  // }
  // }
// correct
//   async createQuotations(req, res) {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       const {
//         clientId,
//         quoteDate,
//         endDate,
//         quoteTime,
//         clientName,
//         clientNo,
//         address,
//         Products,
//         category,
//         status,
//         GrandTotal,
//         adjustments,
//         discount,
//         termsandCondition,
//         GST,
//         executivename,
//         placeaddress,
//         slots,
//       } = req.body;
//  console.log( clientId,
//   quoteDate,
//   endDate,
//   quoteTime,
//   clientName,
//   clientNo,
//   address,
//   Products,
//   category,
//   status,
//   GrandTotal,
//   adjustments,
//   discount,
//   termsandCondition,
//   GST,
//   executivename,
//   placeaddress,
//   slots,)
//   // Generate the next quotation ID
//       const latestQuotation = await Quotationmodel.findOne()
//         .sort({ _id: -1 })
//         .session(session);
//       const nextQuoteId = latestQuotation
//         ? `QT${(parseInt(latestQuotation.quoteId.replace("QT", ""), 10) + 1)
//             .toString()
//             .padStart(4, "0")}`
//         : "QT0001";

//       // Create the new quotation
//       const newQuotation = new Quotationmodel({
//         clientId,
//         quoteId: nextQuoteId,
//         clientName,
//         Products,
//         clientNo,
//         address,
//         category,
//         quoteDate,
//         quoteTime,
//         termsandCondition,
//         GrandTotal,
//         adjustments,
//         discount,
//         GST,
//         status,
//         executivename,
//         endDate,
//         placeaddress,
//         slots,
//       });

//       const savedQuotation = await newQuotation.save({ session });

//       // Update inventory for slots and products
//       for (const slot of slots) {
//         const { Products, slotName } = slot;

//         for (const product of Products) {
//           const { productId, quantity, StockAvailable } = product;
//           console.log(productId, quantity, StockAvailable,"HHH")

//           // Fetch overlapping reservations for the requested date range and slot
//           const overlappingReservations = await InventoryModel.find({
//             productId,
//             $or: [
//               {
//                 startdate: { $lte: endDate },
//                 enddate: { $gte: quoteDate },
//               },
//             ],
//             slot: slotName,
//           }).session(session);

//           let totalReservedQty = overlappingReservations.reduce(
//             (sum, reservation) => sum + reservation.reservedQty,
//             0
//           );

//           // Calculate available stock based on reservations
//           const availableStock = StockAvailable - totalReservedQty;

//           // if (availableStock < quantity) {
//           //     throw new Error(
//           //         `Insufficient stock for product: ${product.productName} in slot: ${slotName}. Only ${availableStock} available due to overlapping reservations.`
//           //     );
//           // }
//           if (availableStock < quantity) {
//             throw new Error(
//               `Insufficient stock for product: ${product.productName} in slot: ${slotName}. Only ${availableStock} available for the requested date range: ${quoteDate} to ${endDate}, due to overlapping reservations.`
//             );
//           }

//           // Update or create inventory for the current slot
//           const existingInventory = await InventoryModel.findOne({
//             productId,
//             startdate: quoteDate,
//             enddate: endDate,
//             slot: slotName,
//           }).session(session);

//           if (existingInventory) {
//             existingInventory.reservedQty += quantity;
//             existingInventory.availableQty = availableStock - quantity;
//             await existingInventory.save({ session });
//           } else {
//             const newInventory = new InventoryModel({
//               productId,
//               startdate: quoteDate,
//               enddate: endDate,
//               slot: slotName,
//               reservedQty: quantity,
//               availableQty: availableStock - quantity,
//             });

//             await newInventory.save({ session });
//           }
//         }
//       }

//       // Commit the transaction
//       await session.commitTransaction();
//       session.endSession();

//       return res.json({
//         success: "Quotation created and inventory updated successfully",
//       });
//     } catch (error) {
//       // Abort the transaction in case of an error
//       await session.abortTransaction();
//       session.endSession();
//       console.error("Error creating quotation:", error);
//       return res
//         .status(500)
//         .json({ error: error.message || "Failed to create Quotation" });
//     }
//   }
// 15-03-25


  async getTotalAndTodayQuotationCount(req, res) {
    try {
      // Get the current date and set the time to the start of the day
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Get the current date and set the time to the end of the day
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Count the total number of documents
      let totalQuotationCount = await Quotationmodel.countDocuments({});

      // Count the number of documents created today
      let todayQuotationCount = await Quotationmodel.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      return res.json({
        totalQuotationCount: totalQuotationCount,
        todayQuotationCount: todayQuotationCount,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve quotation counts" });
    }
  }

  async updatequotefollowup(req, res) {
    let { followupStatus } = req.body;
    let quoteId = req.params.id;

    try {
      const quoteData = await Quotationmodel.findOneAndUpdate(
        { _id: quoteId },
        { followupStatus: followupStatus }
      );

      if (quoteData) {
        return res.status(200).json({ success: "updated succesfully" });
      }
    } catch (error) {
      console.error("Something went wrong", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getquotationaggredata(req, res) {
    const id = req.params.id;

    try {
      const Data = await Quotationmodel.find({ _id: id });

      if (Data.length > 0) {
        return res.json({ QuotationData: Data });
      } else {
        return res.status(404).json({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to retrieve data" });
    }
  }

  // async allquotations(req, res) {
  //     try {
  //         // Fetch all quotations as plain JavaScript objects
  //         const quoteData = await Quotationmodel.find({}).sort({ _id: -1 }).lean();

  //         // Loop through each quotation to enrich slots with inventory data
  //         const enrichedQuotations = await Promise.all(
  //             quoteData.map(async (quote) => {
  //                 const enrichedSlots = await Promise.all(
  //                     quote.slots.map(async (slot) => {
  //                         const enrichedProducts = await Promise.all(
  //                             slot.Products.map(async (product) => {
  //                                 // Fetch overlapping inventory for the product, slot, and date range
  //                                 const overlappingReservations = await InventoryModel.find({
  //                                     productId: product.productId,
  //                                     $or: [
  //                                         {
  //                                             startdate: { $lte: quote.endDate },
  //                                             enddate: { $gte: quote.quoteDate },
  //                                         },
  //                                     ],
  //                                     slot: slot.slotName,
  //                                 });

  //                                 // Calculate total reserved inventory
  //                                 const totalReservedQty = overlappingReservations.reduce(
  //                                     (sum, reservation) => sum + reservation.reservedQty,
  //                                     0
  //                                 );

  //                                 const availableStock =
  //                                     product.StockAvailable - totalReservedQty;

  //                                 // Determine status
  //                                 let status = "Not Available";
  //                                 if (availableStock > 0) {
  //                                     status = "Available";
  //                                 } else if (totalReservedQty >= product.StockAvailable) {
  //                                     status = "Booked";
  //                                 }

  //                                 return {
  //                                     ...product,
  //                                     availableStock,
  //                                     status,
  //                                 };
  //                             })
  //                         );

  //                         // Check if the slot has at least one available product
  //                         const hasAvailableProducts = enrichedProducts.some(
  //                             (product) => product.status === "Available"
  //                         );

  //                         return {
  //                             ...slot,
  //                             Products: enrichedProducts,
  //                             status: hasAvailableProducts ? "Available" : "Not Available",
  //                         };
  //                     })
  //                 );

  //                 return {
  //                     ...quote,
  //                     slots: enrichedSlots,
  //                 };
  //             })
  //         );

  //         return res.status(200).json({ quoteData: enrichedQuotations });
  //     } catch (error) {
  //         console.error("Something went wrong", error);
  //         return res.status(500).json({ error: "Internal server error" });
  //     }
  // }

  async allquotations(req, res) {
    try {
      // Fetch all quotations as plain JavaScript objects
      const quoteData = await Quotationmodel.find({}).sort({ _id: -1 }).lean();

      // Loop through each quotation to enrich slots with inventory data
      const enrichedQuotations = await Promise.all(
        quoteData.map(async (quote) => {
          const enrichedSlots = await Promise.all(
            quote.slots.map(async (slot) => {
              const enrichedProducts = await Promise.all(
                slot.Products.map(async (product) => {
                  // Fetch overlapping inventory for the product, slot, and date range
                  const overlappingReservations = await InventoryModel.find({
                    productId: product.productId,
                    $or: [
                      {
                        startdate: { $lte: quote.endDate },
                        enddate: { $gte: quote.quoteDate },
                      },
                    ],
                    slot: slot.slotName,
                  });

                  // Calculate total reserved inventory
                  const totalReservedQty = overlappingReservations.reduce(
                    (sum, reservation) => sum + reservation.reservedQty,
                    0
                  );

                  const availableStock =
                    product.StockAvailable - totalReservedQty;

                  // Determine status
                  let status = "Not Available";
                  if (availableStock > 0) {
                    status = "Available";
                  } else if (totalReservedQty >= product.StockAvailable) {
                    status = "Booked";
                  }

                  return {
                    ...product,
                    availableStock,
                    status,
                  };
                })
              );

              // Check if the slot has at least one available product
              const hasAvailableProducts = enrichedProducts.some(
                (product) => product.status === "Available"
              );

              return {
                ...slot,
                Products: enrichedProducts,
                status: hasAvailableProducts ? "Available" : "Not Available",
              };
            })
          );

          return {
            ...quote,
            slots: enrichedSlots,
          };
        })
      );

      return res.status(200).json({ quoteData: enrichedQuotations });
    } catch (error) {
      console.error("Something went wrong", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // async allquotations(req, res) {
  //   try {
  //     const quoteData = await Quotationmodel.find({}).sort({ _id: -1 });

  //     console.log("quoteData--",quoteData);
  //     console.log("slots--",quoteData[0]?.slots[0]?.Products)

  //     if (quoteData) {
  //       return res.status(200).json({ quoteData: quoteData });
  //     }
  //   } catch (error) {
  //     console.error("Something went wrong", error);
  //     return res.status(500).json({ error: "Internal server error" });
  //   }
  // }

  async postdeletequotation(req, res) {
    let id = req.params.id;
    try {
      const data = await Quotationmodel.deleteOne({ _id: id });
      if (data.deletedCount > 0) {
        return res.json({ success: "Successfully deleted" });
      } else {
        return res.status(404).json({ error: "quotation not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete quotation" });
    }
  }

  async updateQuotation(req, res) {
    const {
      quoteId,
      labourecharge,
      transportcharge,
      adjustments,
      GrandTotal,
      status,
      GST,discount
    } = req.body;
    console.log(
      quoteId,
      labourecharge,
      transportcharge,
      adjustments,
      GrandTotal,
      GST,discount,
      "efirwiu"
    );
    try {
      // Find the quotation by quoteId
      const quotation = await Quotationmodel.findOne({ quoteId });

      if (!quotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }

      // Update the charges if provided
      if (labourecharge !== undefined) {
        quotation.labourecharge = labourecharge;
      }
      if (transportcharge !== undefined) {
        quotation.transportcharge = transportcharge;
      }
      if (adjustments !== undefined) {
        quotation.adjustments = adjustments;
      }
      if (GrandTotal !== undefined) {
        quotation.GrandTotal = GrandTotal;
      }
      if (GST !== undefined) {
        quotation.GST = GST;
      }
      if (discount !== undefined) {
        quotation.discount = discount;
      }


      if (status !== undefined) {
        if (["pending", "send"].includes(status)) {
          quotation.status = status; // Update status if valid
        } else {
          return res.status(400).json({ error: "Invalid status value" });
        }
      }

      // Save the updated quotation
      const updatedQuotation = await quotation.save();

      return res.status(200).json({
        success: "Quotation updated successfully",
        data: updatedQuotation,
      });
    } catch (error) {
      console.error("Error updating quotation:", error.message);
      return res.status(500).json({ error: "Failed to update quotation" });
    }
  }

  // addproductquotations
  // async addProductsToSlots(req, res) {
  //   const { id, slots,GrandTotal } = req.body;
  //   console.log(id,slots,"slots")
  //   try {
  //     // Find the quotation by quoteId
  //     const quotation = await Quotationmodel.findOne({ quoteId: id });

  //     if (!quotation) {
  //       return res.status(404).json({ error: "Quotation not found" });
  //     }

  //     // Validate slots array
  //     if (!Array.isArray(slots) || slots.length === 0) {
  //       return res.status(400).json({ error: "Slots must be a non-empty array" });
  //     }

  //     // Update or add slots
  //     slots.forEach((newSlot) => {
  //       const existingSlotIndex = quotation.slots.findIndex(
  //         (slot) => slot.slotName === newSlot.slotName
  //       );

  //       if (existingSlotIndex !== -1) {
  //         // If the slot exists, merge its products with the new products
  //         quotation.slots[existingSlotIndex].Products.push(...newSlot.Products);
  //       } else {
  //         // If the slot does not exist, add it as a new slot
  //         quotation.slots.push(newSlot);
  //       }
  //     });

  //     // Save the updated quotation
  //     const updatedQuotation = await quotation.save();

  //     return res.status(200).json({
  //       success: "Products added to slots successfully",
  //       data: updatedQuotation,
  //     });
  //   } catch (error) {
  //     console.error("Error adding products to slots:", error.message);
  //     return res.status(500).json({ error: "Failed to add products to slots" });
  //   }
  // }

  // this code working fine whiout inventory
  // async addProductsToSlots(req, res) {
  //   const { id, slots, GrandTotal } = req.body;
  //   // console.log(id, slots,GrandTotal, "slots");

  //   try {
  //     // Find the quotation by quoteId
  //     const quotation = await Quotationmodel.findOne({ quoteId: id });

  //     if (!quotation) {
  //       return res.status(404).json({ error: "Quotation not found" });
  //     }

  //     // Validate slots array
  //     if (!Array.isArray(slots) || slots.length === 0) {
  //       return res.status(400).json({ error: "Slots must be a non-empty array" });
  //     }

  //     // Update or add slots
  //     slots.forEach((newSlot) => {
  //       const existingSlotIndex = quotation.slots.findIndex(
  //         (slot) => slot.slotName === newSlot.slotName
  //       );

  //       if (existingSlotIndex !== -1) {
  //         // If the slot exists, merge its products with the new products
  //         quotation.slots[existingSlotIndex].Products.push(...newSlot.Products);
  //       } else {
  //         // If the slot does not exist, add it as a new slot
  //         quotation.slots.push(newSlot);
  //       }
  //     });

  //     // Update the GrandTotal in the database
  //     if (GrandTotal !== undefined) {
  //       quotation.GrandTotal = GrandTotal;
  //     }

  //     // Save the updated quotation
  //     const updatedQuotation = await quotation.save();

  //     return res.status(200).json({
  //       success: "Products added to slots successfully and GrandTotal updated",
  //       data: updatedQuotation,
  //     });
  //   } catch (error) {
  //     console.error("Error adding products to slots:", error.message);
  //     return res.status(500).json({ error: "Failed to add products to slots" });
  //   }
  // }

  // this code is inventory management system +++++
  async addProductsToSlots(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id, slots, GrandTotal } = req.body;

      // Find the quotation by quoteId
      const quotation = await Quotationmodel.findOne({ quoteId: id }).session(
        session
      );

      if (!quotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }

      // Validate slots array
      if (!Array.isArray(slots) || slots.length === 0) {
        return res
          .status(400)
          .json({ error: "Slots must be a non-empty array" });
      }

      for (const newSlot of slots) {
        const existingSlotIndex = quotation.slots.findIndex(
          (slot) => slot.slotName === newSlot.slotName
        );

        if (existingSlotIndex !== -1) {
          // Merge products into the existing slot
          for (const newProduct of newSlot.Products) {
            const { productId, quantity, StockAvailable } = newProduct;

            // Check inventory for availability
            const overlappingReservations = await InventoryModel.find({
              productId,
              $or: [
                {
                  startdate: { $lte: quotation.endDate },
                  enddate: { $gte: quotation.quoteDate },
                },
              ],
              slot: newSlot.slotName,
            }).session(session);

            const totalReservedQty = overlappingReservations.reduce(
              (sum, reservation) => sum + reservation.reservedQty,
              0
            );

            const availableStock = StockAvailable - totalReservedQty;

            if (availableStock < quantity) {
              throw new Error(
                `Insufficient stock for product: ${newProduct.productName} in slot: ${newSlot.slotName}. Only ${availableStock} available due to overlapping reservations.`
              );
            }

            const existingProductIndex = quotation.slots[
              existingSlotIndex
            ].Products.findIndex(
              (product) => product.productId === newProduct.productId
            );

            if (existingProductIndex !== -1) {
              // If the product exists, optionally update its quantity
              console.log(
                `Product ${newProduct.productId} already exists in slot ${newSlot.slotName}, skipping.`
              );
            } else {
              // Add the product as a new entry
              quotation.slots[existingSlotIndex].Products.push({
                ...newProduct,
                StockAvailable: availableStock - quantity,
              });
            }

            // Update or create inventory for the current slot
            const existingInventory = await InventoryModel.findOne({
              productId,
              startdate: quotation.quoteDate,
              enddate: quotation.endDate,
              slot: newSlot.slotName,
            }).session(session);

            if (existingInventory) {
              existingInventory.reservedQty += quantity;
              existingInventory.availableQty = availableStock - quantity;
              await existingInventory.save({ session });
            } else {
              const newInventory = new InventoryModel({
                productId,
                startdate: quotation.quoteDate,
                enddate: quotation.endDate,
                slot: newSlot.slotName,
                reservedQty: quantity,
                availableQty: availableStock - quantity,
              });

              await newInventory.save({ session });
            }
          }
        } else {
          // If the slot does not exist, add it as a new slot
          quotation.slots.push(newSlot);

          for (const newProduct of newSlot.Products) {
            const { productId, quantity, StockAvailable } = newProduct;

            // Check inventory for availability
            const overlappingReservations = await InventoryModel.find({
              productId,
              $or: [
                {
                  startdate: { $lte: quotation.endDate },
                  enddate: { $gte: quotation.quoteDate },
                },
              ],
              slot: newSlot.slotName,
            }).session(session);

            const totalReservedQty = overlappingReservations.reduce(
              (sum, reservation) => sum + reservation.reservedQty,
              0
            );

            const availableStock = StockAvailable - totalReservedQty;

            if (availableStock < quantity) {
              throw new Error(
                `Insufficient stock for product: ${newProduct.productName} in slot: ${newSlot.slotName}. Only ${availableStock} available due to overlapping reservations.`
              );
            }

            // Update or create inventory for the new slot
            const newInventory = new InventoryModel({
              productId,
              startdate: quotation.quoteDate,
              enddate: quotation.endDate,
              slot: newSlot.slotName,
              reservedQty: quantity,
              availableQty: availableStock - quantity,
            });

            await newInventory.save({ session });
          }
        }
      }

      // Update the GrandTotal
      if (GrandTotal !== undefined) {
        quotation.GrandTotal = GrandTotal;
      }

      // Save the updated quotation
      const updatedQuotation = await quotation.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: "Products added to slots successfully and inventory updated",
        data: updatedQuotation,
      });
    } catch (error) {
      // Abort the transaction in case of an error
      await session.abortTransaction();
      session.endSession();
      console.error("Error adding products to slots:", error.message);
      return res
        .status(500)
        .json({ error: error.message || "Failed to add products to slots" });
    }
  }

  // chaubay

  // async addOntherProductsToSlots(req, res) {
  //   const { id, slots, GrandTotal, productId } = req.body;

  //   console.log("Request Data:", { id, slots, GrandTotal, productId });

  //   try {
  //     // Find the quotation by quoteId
  //     const quotation = await Quotationmodel.findOne({ quoteId: id });

  //     if (!quotation) {
  //       return res.status(404).json({ error: "Quotation not found" });
  //     }

  //     // Validate slots array
  //     if (!Array.isArray(slots) || slots.length === 0) {
  //       return res.status(400).json({ error: "Slots must be a non-empty array" });
  //     }

  //     slots.forEach((newSlot) => {
  //       const existingSlotIndex = quotation.slots.findIndex(
  //         (slot) => slot.slotName === newSlot.slotName
  //       );

  //       if (existingSlotIndex === -1) {
  //         return res
  //           .status(400)
  //           .json({ error: `Slot ${newSlot.slotName} does not exist.` });
  //       }

  //       const existingProducts = Array.isArray(
  //         quotation.slots[existingSlotIndex].Products
  //       )
  //         ? quotation.slots[existingSlotIndex].Products
  //         : [];

  //       const newProducts = Array.isArray(newSlot.Products) ? newSlot.Products : [];

  //       newProducts.forEach((newProduct) => {
  //         const existingProductIndex = existingProducts.findIndex(
  //           (product) => product.productId === newProduct.productId
  //         );

  //         const productQuantity = Number(newProduct.quantity);
  //         const productPrice = Number(newProduct.price);
  //         const stockAvailable = Number(newProduct.StockAvailable);

  //         if (
  //           isNaN(productQuantity) ||
  //           isNaN(productPrice) ||
  //           isNaN(stockAvailable)
  //         ) {
  //           console.error(
  //             `Invalid product data: ${JSON.stringify(newProduct)}`
  //           );
  //           return; // Skip invalid product
  //         }

  //         if (existingProductIndex !== -1) {
  //           const existingProduct = existingProducts[existingProductIndex];

  //           if (productQuantity <= stockAvailable) {
  //             // Update existing product
  //             existingProduct.quantity += productQuantity;
  //             existingProduct.total += productQuantity * productPrice;
  //             existingProduct.StockAvailable -= productQuantity;
  //           } else {
  //             // Use up all available stock and add remaining as a new product
  //             const remainingStock = productQuantity - stockAvailable;

  //             existingProduct.quantity += stockAvailable;
  //             existingProduct.total += stockAvailable * productPrice;
  //             existingProduct.StockAvailable = 0;

  //             // Add remaining as a new product if stock is exceeded
  //             existingProducts.push({
  //               productId: newProduct.productId,
  //               productName: newProduct.productName || "Unnamed Product",
  //               quantity: remainingStock,
  //               price: productPrice,
  //               total: remainingStock * productPrice,
  //               StockAvailable: 0, // No stock left for this product
  //             });
  //           }
  //         } else {
  //           // Add new product
  //           const quantityToAdd =
  //             productQuantity <= stockAvailable ? productQuantity : stockAvailable;

  //           existingProducts.push({
  //             productId: newProduct.productId,
  //             productName: newProduct.productName || "Unnamed Product",
  //             quantity: quantityToAdd,
  //             price: productPrice,
  //             total: quantityToAdd * productPrice,
  //             StockAvailable: stockAvailable - quantityToAdd,
  //           });

  //           // If there's an excess order, add remaining as a new product
  //           if (productQuantity > stockAvailable) {
  //             const remainingQuantity = productQuantity - stockAvailable;

  //             existingProducts.push({
  //               productId: newProduct.productId,
  //               productName: newProduct.productName || "Unnamed Product",
  //               quantity: remainingQuantity,
  //               price: productPrice,
  //               total: remainingQuantity * productPrice,
  //               StockAvailable: 0, // No stock left for this product
  //             });
  //           }
  //         }
  //       });

  //       // Update the slot with updated products
  //       quotation.slots[existingSlotIndex].Products = existingProducts.filter(
  //         (product) => product.quantity > 0
  //       );
  //     });

  //     // Recalculate the GrandTotal
  //     const updatedGrandTotal = quotation.slots.reduce((total, slot) => {
  //       const slotTotal = slot.Products.reduce((sum, product) => {
  //         const productTotal = Number(product.total) || 0;
  //         return sum + productTotal;
  //       }, 0);
  //       return total + slotTotal;
  //     }, 0);

  //     if (isNaN(updatedGrandTotal)) {
  //       throw new Error("Invalid GrandTotal calculation");
  //     }

  //     quotation.GrandTotal = updatedGrandTotal;

  //     // Save the updated quotation
  //     const updatedQuotation = await quotation.save();

  //     return res.status(200).json({
  //       success: "Products added to existing slots successfully and GrandTotal updated",
  //       data: updatedQuotation,
  //     });
  //   } catch (error) {
  //     console.error("Error adding products to slots:", error.message);
  //     return res.status(500).json({ error: "Failed to add products to slots" });
  //   }
  // }

  // async addOntherProductsToSlots(req, res) {
  //   const { id, slots, productId } = req.body;

  //   console.log("Request Data:", { id, slots, productId });

  //   try {
  //     // Find the quotation by quoteId
  //     const quotation = await Quotationmodel.findOne({ quoteId: id });

  //     if (!quotation) {
  //       return res.status(404).json({ error: "Quotation not found" });
  //     }

  //     // Validate slots array
  //     if (!Array.isArray(slots) || slots.length === 0) {
  //       return res.status(400).json({ error: "Slots must be a non-empty array" });
  //     }

  //     slots.forEach((newSlot) => {
  //       const existingSlotIndex = quotation.slots.findIndex(
  //         (slot) => slot.slotName === newSlot.slotName
  //       );

  //       if (existingSlotIndex === -1) {
  //         throw new Error(`Slot ${newSlot.slotName} does not exist.`);
  //       }

  //       const existingProducts = Array.isArray(
  //         quotation.slots[existingSlotIndex].Products
  //       )
  //         ? quotation.slots[existingSlotIndex].Products
  //         : [];

  //       const newProducts = Array.isArray(newSlot.Products) ? newSlot.Products : [];

  //       newProducts.forEach((newProduct) => {
  //         const productQuantity = Number(newProduct.quantity);
  //         const productPrice = Number(newProduct.price);
  //         const stockAvailable = Number(newProduct.StockAvailable || 0);

  //         if (
  //           isNaN(productQuantity) ||
  //           isNaN(productPrice) ||
  //           isNaN(stockAvailable)
  //         ) {
  //           console.error(
  //             `Invalid product data: ${JSON.stringify(newProduct)}`
  //           );
  //           return; // Skip invalid product
  //         }

  //         const existingProductIndex = existingProducts.findIndex(
  //           (product) => product.productId === newProduct.productId
  //         );

  //         if (existingProductIndex !== -1) {
  //           const existingProduct = existingProducts[existingProductIndex];

  //           if (productQuantity <= stockAvailable) {
  //             // Update existing product
  //             existingProduct.quantity += productQuantity;
  //             existingProduct.total += productQuantity * productPrice;
  //             existingProduct.StockAvailable -= productQuantity;
  //           } else {
  //             // Use up all available stock and add remaining as a new product
  //             const remainingQuantity = productQuantity - stockAvailable;

  //             existingProduct.quantity += stockAvailable;
  //             existingProduct.total += stockAvailable * productPrice;
  //             existingProduct.StockAvailable = 0;

  //             // Add remaining as a new product
  //             existingProducts.push({
  //               productId: newProduct.productId,
  //               productName: newProduct.productName || "Unnamed Product",
  //               quantity: remainingQuantity,
  //               price: productPrice,
  //               total: remainingQuantity * productPrice,
  //               StockAvailable: 0, // No stock left for this product
  //             });
  //           }
  //         } else {
  //           // Add new product
  //           const quantityToAdd =
  //             productQuantity <= stockAvailable ? productQuantity : stockAvailable;

  //           existingProducts.push({
  //             productId: newProduct.productId,
  //             productName: newProduct.productName || "Unnamed Product",
  //             quantity: quantityToAdd,
  //             price: productPrice,
  //             total: quantityToAdd * productPrice,
  //             StockAvailable: stockAvailable - quantityToAdd,
  //           });

  //           // Add remaining quantity as a new product if stock is exceeded
  //           if (productQuantity > stockAvailable) {
  //             const remainingQuantity = productQuantity - stockAvailable;

  //             existingProducts.push({
  //               productId: newProduct.productId,
  //               productName: newProduct.productName || "Unnamed Product",
  //               quantity: remainingQuantity,
  //               price: productPrice,
  //               total: remainingQuantity * productPrice,
  //               StockAvailable: 0,
  //             });
  //           }
  //         }
  //       });

  //       // Update the slot with updated products
  //       quotation.slots[existingSlotIndex].Products = existingProducts.filter(
  //         (product) => product.quantity > 0
  //       );
  //     });

  //     // Recalculate the GrandTotal
  //     const updatedGrandTotal = quotation.slots.reduce((total, slot) => {
  //       const slotTotal = slot.Products.reduce((sum, product) => {
  //         const productTotal = Number(product.total) || 0;
  //         return sum + productTotal;
  //       }, 0);
  //       return total + slotTotal;
  //     }, 0);

  //     if (isNaN(updatedGrandTotal)) {
  //       throw new Error("Invalid GrandTotal calculation");
  //     }

  //     quotation.GrandTotal = updatedGrandTotal;

  //     // Save the updated quotation
  //     const updatedQuotation = await quotation.save();

  //     return res.status(200).json({
  //       success: "Products added to existing slots successfully and GrandTotal updated",
  //       data: updatedQuotation,
  //     });
  //   } catch (error) {
  //     console.error("Error adding products to slots:", error.message);
  //     return res.status(500).json({ error: error.message || "Failed to add products to slots" });
  //   }
  // }

  // async addOntherProductsToSlots(req, res) {
  //   const { id, slots, productId } = req.body;

  //   console.log("Request Data:", { id, slots, productId });

  //   try {
  //     // Find the quotation by quoteId
  //     const quotation = await Quotationmodel.findOne({ quoteId: id });

  //     if (!quotation) {
  //       return res.status(404).json({ error: "Quotation not found" });
  //     }

  //     // Validate slots array
  //     if (!Array.isArray(slots) || slots.length === 0) {
  //       return res.status(400).json({ error: "Slots must be a non-empty array" });
  //     }

  //     slots.forEach((newSlot) => {
  //       const existingSlotIndex = quotation.slots.findIndex(
  //         (slot) => slot.slotName === newSlot.slotName
  //       );

  //       if (existingSlotIndex === -1) {
  //         throw new Error(`Slot ${newSlot.slotName} does not exist.`);
  //       }

  //       const existingProducts = Array.isArray(
  //         quotation.slots[existingSlotIndex].Products
  //       )
  //         ? quotation.slots[existingSlotIndex].Products
  //         : [];

  //       const newProducts = Array.isArray(newSlot.Products) ? newSlot.Products : [];

  //       newProducts.forEach((newProduct) => {
  //         const productQuantity = Number(newProduct.quantity);
  //         const productPrice = Number(newProduct.price);
  //         const stockAvailable = Number(newProduct.StockAvailable || 0);

  //         if (
  //           isNaN(productQuantity) ||
  //           isNaN(productPrice) ||
  //           isNaN(stockAvailable)
  //         ) {
  //           console.error(
  //             `Invalid product data: ${JSON.stringify(newProduct)}`
  //           );
  //           return; // Skip invalid product
  //         }

  //         const existingProductIndex = existingProducts.findIndex(
  //           (product) => product.productId === newProduct.productId
  //         );

  //         if (existingProductIndex !== -1) {
  //           // Update the existing product
  //           const existingProduct = existingProducts[existingProductIndex];

  //           if (productQuantity <= existingProduct.quantity) {
  //             // Deduct the alternate product quantity from the main product
  //             existingProduct.quantity -= productQuantity;
  //             existingProduct.total -= productQuantity * existingProduct.price;
  //             existingProduct.StockAvailable += productQuantity;

  //             // Check if the alternate product already exists in the array
  //             const alternateProductIndex = existingProducts.findIndex(
  //               (product) =>
  //                 product.productId === newProduct.productId &&
  //                 product.productName === newProduct.productName
  //             );

  //             if (alternateProductIndex !== -1) {
  //               // Update the existing alternate product
  //               existingProducts[alternateProductIndex].quantity += productQuantity;
  //               existingProducts[alternateProductIndex].total +=
  //                 productQuantity * productPrice;
  //             } else {
  //               // Add the alternate product as a new entry
  //               existingProducts.push({
  //                 productId: newProduct.productId,
  //                 productName: newProduct.productName || "Alternate Product",
  //                 quantity: productQuantity,
  //                 price: productPrice,
  //                 total: productQuantity * productPrice,
  //                 StockAvailable: stockAvailable - productQuantity,
  //               });
  //             }
  //           } else {
  //             throw new Error(
  //               `Insufficient quantity for product ${existingProduct.productName}`
  //             );
  //           }
  //         } else {
  //           // Add new product if it's not already in the slot
  //           existingProducts.push({
  //             productId: newProduct.productId,
  //             productName: newProduct.productName || "Alternate Product",
  //             quantity: productQuantity,
  //             price: productPrice,
  //             total: productQuantity * productPrice,
  //             StockAvailable: stockAvailable - productQuantity,
  //           });
  //         }
  //       });

  //       // Update the slot with updated products
  //       quotation.slots[existingSlotIndex].Products = existingProducts.filter(
  //         (product) => product.quantity > 0
  //       );
  //     });

  //     // Recalculate the GrandTotal
  //     const updatedGrandTotal = quotation.slots.reduce((total, slot) => {
  //       const slotTotal = slot.Products.reduce((sum, product) => {
  //         const productTotal = Number(product.total) || 0;
  //         return sum + productTotal;
  //       }, 0);
  //       return total + slotTotal;
  //     }, 0);

  //     if (isNaN(updatedGrandTotal)) {
  //       throw new Error("Invalid GrandTotal calculation");
  //     }

  //     quotation.GrandTotal = updatedGrandTotal;

  //     // Save the updated quotation
  //     const updatedQuotation = await quotation.save();

  //     return res.status(200).json({
  //       success: "Products and alternate products updated successfully",
  //       data: updatedQuotation,
  //     });
  //   } catch (error) {
  //     console.error("Error adding alternate products to slots:", error.message);
  //     return res.status(500).json({ error: error.message || "Failed to add products to slots" });
  //   }
  // }
  async addOntherProductsToSlots(req, res) {
    const { id, slots, productId } = req.body;

    console.log("Request Data:", { id, slots, productId });

    try {
      // Find the quotation by quoteId
      const quotation = await Quotationmodel.findOne({ quoteId: id });

      if (!quotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }

      // Validate slots array
      if (!Array.isArray(slots) || slots.length === 0) {
        return res
          .status(400)
          .json({ error: "Slots must be a non-empty array" });
      }

      slots.forEach((newSlot) => {
        const existingSlotIndex = quotation.slots.findIndex(
          (slot) => slot.slotName === newSlot.slotName
        );

        if (existingSlotIndex === -1) {
          throw new Error(`Slot ${newSlot.slotName} does not exist.`);
        }

        const existingProducts = Array.isArray(
          quotation.slots[existingSlotIndex].Products
        )
          ? quotation.slots[existingSlotIndex].Products
          : [];

        const newProducts = Array.isArray(newSlot.Products)
          ? newSlot.Products
          : [];

        newProducts.forEach((newProduct) => {
          const productQuantity = Number(newProduct.quantity);
          const productPrice = Number(newProduct.price);
          const stockAvailable = Number(newProduct.StockAvailable || 0);

          if (
            isNaN(productQuantity) ||
            isNaN(productPrice) ||
            isNaN(stockAvailable)
          ) {
            console.error(
              `Invalid product data: ${JSON.stringify(newProduct)}`
            );
            return; // Skip invalid product
          }

          const existingProductIndex = existingProducts.findIndex(
            (product) => product.productId === newProduct.productId
          );

          if (existingProductIndex !== -1) {
            const existingProduct = existingProducts[existingProductIndex];

            if (productQuantity <= existingProduct.quantity) {
              // Deduct the alternate product quantity from the main product
              existingProduct.quantity -= productQuantity;
              existingProduct.total -= productQuantity * existingProduct.price;

              // Update the `StockAvailable` for the alternate product
              newProduct.StockAvailable =
                existingProduct.StockAvailable - productQuantity;

              // Add or update the alternate product
              const alternateProductIndex = existingProducts.findIndex(
                (product) =>
                  product.productId === newProduct.productId &&
                  product.productName === newProduct.productName
              );

              if (alternateProductIndex !== -1) {
                // Update the existing alternate product
                existingProducts[alternateProductIndex].quantity +=
                  productQuantity;
                existingProducts[alternateProductIndex].total +=
                  productQuantity * productPrice;
              } else {
                // Add the alternate product as a new entry
                existingProducts.push({
                  productId: newProduct.productId,
                  productName: newProduct.productName || "Alternate Product",
                  quantity: productQuantity,
                  price: productPrice,
                  total: productQuantity * productPrice,
                  StockAvailable: Math.max(stockAvailable - productQuantity, 0),
                });
              }
            } else {
              throw new Error(
                `Insufficient quantity for product ${existingProduct.productName}`
              );
            }
          } else {
            // Add the alternate product if it doesn't already exist
            existingProducts.push({
              productId: newProduct.productId,
              productName: newProduct.productName || "Alternate Product",
              quantity: productQuantity,
              price: productPrice,
              total: productQuantity * productPrice,
              StockAvailable: Math.max(stockAvailable - productQuantity, 0),
            });
          }
        });

        // Update the slot with updated products
        quotation.slots[existingSlotIndex].Products = existingProducts.filter(
          (product) => product.quantity > 0
        );
      });

      // Recalculate the GrandTotal
      const updatedGrandTotal = quotation.slots.reduce((total, slot) => {
        const slotTotal = slot.Products.reduce((sum, product) => {
          const productTotal = Number(product.total) || 0;
          return sum + productTotal;
        }, 0);
        return total + slotTotal;
      }, 0);

      if (isNaN(updatedGrandTotal)) {
        throw new Error("Invalid GrandTotal calculation");
      }

      quotation.GrandTotal = updatedGrandTotal;

      // Save the updated quotation
      const updatedQuotation = await quotation.save();

      return res.status(200).json({
        success: "Products and alternate products updated successfully",
        data: updatedQuotation,
      });
    } catch (error) {
      console.error("Error adding alternate products to slots:", error.message);
      return res
        .status(500)
        .json({ error: error.message || "Failed to add products to slots" });
    }
  }

  // update quotation
  async updateQuotation1(req, res) {
    const { quoteId, labourecharge, transportcharge, GrandTotal, adjustments, GST,discount } =
      req.body;
    console.log(labourecharge, transportcharge, GrandTotal, adjustments,GST,discount );

    try {
      // Fetch the quotation by ID
      const quotation = await Quotationmodel.findOne({ quoteId });

      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      // Update labor and transport charges
      if (labourecharge !== undefined) {
        quotation.labourecharge = labourecharge;
      }

      if (transportcharge !== undefined) {
        quotation.transportcharge = transportcharge;
      }
      if (GrandTotal !== undefined) {
        quotation.GrandTotal = GrandTotal;
      }
      if (adjustments !== undefined) {
        quotation.adjustments = adjustments;
      }
       if (GST !== undefined) {
        quotation.GST = GST;
      }
      if (discount !== undefined) {
        quotation.discount = discount;
      }
      // Save the updated quotation
      const updatedQuotation = await quotation.save();

      // Send updated grand total and response back to the frontend
      res.status(200).json({
        message: "Quotation updated successfully",
        GrandTotal: quotation.GrandTotal,
        updatedQuotation,
      });
    } catch (error) {
      console.error("Error updating quotation:", error);
      res.status(500).json({ message: "Error updating quotation", error });
    }
  }

  // addonthersproductsameslote
  // async addOntherProductsToSlotstwo(req, res) {
  //   const { id, slots } = req.body;

  //   console.log("Request Data:", { id, slots });

  //   try {
  //     // Find the quotation by quoteId
  //     const quotation = await Quotationmodel.findOne({ quoteId: id });

  //     if (!quotation) {
  //       return res.status(404).json({ error: "Quotation not found" });
  //     }

  //     // Validate slots array
  //     if (!Array.isArray(slots) || slots.length === 0) {
  //       return res.status(400).json({ error: "Slots must be a non-empty array" });
  //     }

  //     slots.forEach((newSlot) => {
  //       const existingSlotIndex = quotation.slots.findIndex(
  //         (slot) => slot.slotName === newSlot.slotName
  //       );

  //       if (existingSlotIndex === -1) {
  //         throw new Error(`Slot ${newSlot.slotName} does not exist.`);
  //       }

  //       const existingProducts = Array.isArray(
  //         quotation.slots[existingSlotIndex].Products
  //       )
  //         ? quotation.slots[existingSlotIndex].Products
  //         : [];

  //       const newProducts = Array.isArray(newSlot.Products) ? newSlot.Products : [];

  //       newProducts.forEach((newProduct) => {
  //         const productQuantity = Number(newProduct.quantity);
  //         const productPrice = Number(newProduct.price);
  //         const stockAvailable = Number(newProduct.StockAvailable || 0);

  //         if (isNaN(productQuantity) || isNaN(productPrice) || isNaN(stockAvailable)) {
  //           console.error(`Invalid product data: ${JSON.stringify(newProduct)}`);
  //           return; // Skip invalid product
  //         }

  //         const existingProductIndex = existingProducts.findIndex(
  //           (product) => product.productId === newProduct.productId
  //         );

  //         if (existingProductIndex === -1) {
  //           // Add the product as a new entry
  //           existingProducts.push({
  //             productId: newProduct.productId,
  //             productName: newProduct.productName || "New Product",
  //             quantity: productQuantity,
  //             price: productPrice,
  //             total: productQuantity * productPrice,
  //             StockAvailable: Math.max(stockAvailable - productQuantity, 0),
  //           });
  //         }
  //       });

  //       // Update the slot with updated products
  //       quotation.slots[existingSlotIndex].Products = existingProducts;
  //     });

  //     // Recalculate the GrandTotal
  //     const updatedGrandTotal = quotation.slots.reduce((total, slot) => {
  //       const slotTotal = slot.Products.reduce((sum, product) => {
  //         const productTotal = Number(product.total) || 0;
  //         return sum + productTotal;
  //       }, 0);
  //       return total + slotTotal;
  //     }, 0);

  //     if (isNaN(updatedGrandTotal)) {
  //       throw new Error("Invalid GrandTotal calculation");
  //     }

  //     quotation.GrandTotal = updatedGrandTotal;

  //     // Save the updated quotation
  //     const updatedQuotation = await quotation.save();

  //     return res.status(200).json({
  //       success: "Products added successfully to slots",
  //       data: updatedQuotation,
  //     });
  //   } catch (error) {
  //     console.error("Error adding products to slots:", error.message);
  //     return res
  //       .status(500)
  //       .json({ error: error.message || "Failed to add products to slots" });
  //   }
  // }

  // coment this code without inventory+++++
  // async addOntherProductsToSlotstwo(req, res) {
  //   const { id, slots } = req.body;

  //   console.log("Request Data:", { id, slots });

  //   try {
  //     // Find the quotation by quoteId
  //     const quotation = await Quotationmodel.findOne({ quoteId: id });

  //     if (!quotation) {
  //       return res.status(404).json({ error: "Quotation not found" });
  //     }

  //     // Validate slots array
  //     if (!Array.isArray(slots) || slots.length === 0) {
  //       return res.status(400).json({ error: "Slots must be a non-empty array" });
  //     }

  //     slots.forEach((newSlot) => {
  //       const existingSlotIndex = quotation.slots.findIndex(
  //         (slot) => slot.slotName === newSlot.slotName
  //       );

  //       if (existingSlotIndex === -1) {
  //         throw new Error(`Slot ${newSlot.slotName} does not exist.`);
  //       }

  //       const existingProducts = Array.isArray(
  //         quotation.slots[existingSlotIndex].Products
  //       )
  //         ? quotation.slots[existingSlotIndex].Products
  //         : [];

  //       const newProducts = Array.isArray(newSlot.Products) ? newSlot.Products : [];

  //       newProducts.forEach((newProduct) => {
  //         const productQuantity = Number(newProduct.quantity);
  //         const productPrice = Number(newProduct.price);
  //         const stockAvailable = Number(newProduct.StockAvailable || 0);

  //         // Log for debugging
  //         console.log("Processing Product:", {
  //           productId: newProduct.productId,
  //           stockAvailable,
  //           productQuantity,
  //         });

  //         if (
  //           isNaN(productQuantity) ||
  //           isNaN(productPrice) ||
  //           isNaN(stockAvailable)
  //         ) {
  //           console.error(`Invalid product data: ${JSON.stringify(newProduct)}`);
  //           return; // Skip invalid product
  //         }

  //         const existingProductIndex = existingProducts.findIndex(
  //           (product) => product.productId === newProduct.productId
  //         );

  //         if (existingProductIndex === -1) {
  //           // Add the product as a new entry
  //           existingProducts.push({
  //             productId: newProduct.productId,
  //             productName: newProduct.productName || "New Product",
  //             quantity: productQuantity,
  //             price: productPrice,
  //             total: productQuantity * productPrice,
  //             StockAvailable:
  //               stockAvailable >= productQuantity
  //                 ? stockAvailable - productQuantity
  //                 : stockAvailable, // Only subtract if stock is sufficient
  //           });
  //         } else {
  //           // If product exists, optionally update stock or quantity
  //           console.log(
  //             `Product ${newProduct.productId} already exists in slot ${newSlot.slotName}, skipping.`
  //           );
  //         }
  //       });

  //       // Update the slot with updated products
  //       quotation.slots[existingSlotIndex].Products = existingProducts;
  //     });

  //     // Recalculate the GrandTotal
  //     const updatedGrandTotal = quotation.slots.reduce((total, slot) => {
  //       const slotTotal = slot.Products.reduce((sum, product) => {
  //         const productTotal = Number(product.total) || 0;
  //         return sum + productTotal;
  //       }, 0);
  //       return total + slotTotal;
  //     }, 0);

  //     if (isNaN(updatedGrandTotal)) {
  //       throw new Error("Invalid GrandTotal calculation");
  //     }

  //     quotation.GrandTotal = updatedGrandTotal;

  //     // Save the updated quotation
  //     const updatedQuotation = await quotation.save();

  //     return res.status(200).json({
  //       success: "Products added successfully to slots",
  //       data: updatedQuotation,
  //     });
  //   } catch (error) {
  //     console.error("Error adding products to slots:", error.message);
  //     return res
  //       .status(500)
  //       .json({ error: error.message || "Failed to add products to slots" });
  //   }
  // }

  // this code is implement with inventory

  // 17-01-22024

  async addOntherProductsToSlotstwo(req, res) {
    const { id, slots } = req.body;

    console.log("Request Data:", { id, slots });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the quotation by quoteId
      const quotation = await Quotationmodel.findOne({ quoteId: id }).session(
        session
      );

      if (!quotation) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: "Quotation not found" });
      }

      // Validate slots array
      if (!Array.isArray(slots) || slots.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ error: "Slots must be a non-empty array" });
      }

      slots.forEach((newSlot) => {
        const existingSlotIndex = quotation.slots.findIndex(
          (slot) => slot.slotName === newSlot.slotName
        );

        if (existingSlotIndex === -1) {
          throw new Error(`Slot ${newSlot.slotName} does not exist.`);
        }

        const existingProducts = Array.isArray(
          quotation.slots[existingSlotIndex].Products
        )
          ? quotation.slots[existingSlotIndex].Products
          : [];

        const newProducts = Array.isArray(newSlot.Products)
          ? newSlot.Products
          : [];

        newProducts.forEach((newProduct) => {
          const productQuantity = Number(newProduct.quantity);
          const productPrice = Number(newProduct.price);
          const stockAvailable = Number(newProduct.StockAvailable || 0);

          // Log for debugging
          console.log("Processing Product:", {
            productId: newProduct.productId,
            stockAvailable,
            productQuantity,
          });

          if (
            isNaN(productQuantity) ||
            isNaN(productPrice) ||
            isNaN(stockAvailable)
          ) {
            console.error(
              `Invalid product data: ${JSON.stringify(newProduct)}`
            );
            return; // Skip invalid product
          }

          const existingProductIndex = existingProducts.findIndex(
            (product) => product.productId === newProduct.productId
          );

          if (existingProductIndex === -1) {
            // Add the product as a new entry
            existingProducts.push({
              productId: newProduct.productId,
              productName: newProduct.productName || "New Product",
              quantity: productQuantity,
              price: productPrice,
              total: productQuantity * productPrice,
              StockAvailable:stockAvailable
                // stockAvailable >= productQuantity
                  // ? stockAvailable - productQuantity
                  // : stockAvailable, // Only subtract if stock is sufficient
            });
          } else {
            // If product exists, optionally update stock or quantity
            console.log(
              `Product ${newProduct.productId} already exists in slot ${newSlot.slotName}, skipping.`
            );
          }
        });

        // Update the slot with updated products
        quotation.slots[existingSlotIndex].Products = existingProducts;
      });

      // Recalculate the GrandTotal
      const updatedGrandTotal = quotation.slots.reduce((total, slot) => {
        const slotTotal = slot.Products.reduce((sum, product) => {
          const productTotal = Number(product.total) || 0;
          return sum + productTotal;
        }, 0);
        return total + slotTotal;
      }, 0);

      if (isNaN(updatedGrandTotal)) {
        throw new Error("Invalid GrandTotal calculation");
      }

      quotation.GrandTotal = updatedGrandTotal;

      // Save the updated quotation
      const updatedQuotation = await quotation.save({ session });

      for (const slot of slots) {
        const { Products, slotName } = slot;
        console.log("Products1111--", Products);
        const lastProduct = Products[Products.length - 1];

        console.log("lastProduct", lastProduct);
        const dataa = [lastProduct];

        for (const product of dataa) {
          const { productId, quantity, StockAvailable } = product;

          // Fetch overlapping reservations for the requested date range and slot
          const overlappingReservations = await InventoryModel.find({
            productId,
            $or: [
              {
                startdate: { $lte: quotation.endDate },
                enddate: { $gte: quotation.quoteDate },
              },
            ],
            slot: slotName,
          }).session(session);

          // Calculate total reserved inventory during the requested slot
          let totalReservedQty = overlappingReservations.reduce(
            (sum, reservation) => sum + reservation.reservedQty,
            0
          );

          console.log("product--", product);
          // Calculate available stock based on reservations
          const availableStock = StockAvailable - totalReservedQty;

          if (availableStock < quantity) {
            throw new Error(
              `Insufficient stock for product: ${product.productName} in slot: ${slotName}. Only ${availableStock} available for the requested date range: ${quotation.quoteDate} to ${quotation.endDate}, due to overlapping reservations.`
            );
          }

          // Update or create inventory for the current slot
          const existingInventory = await InventoryModel.findOne({
            productId,
            startdate: quotation.quoteDate,
            enddate: quotation.endDate,
            slot: slotName,
          }).session(session);

          if (existingInventory) {
            existingInventory.reservedQty += quantity;
            existingInventory.availableQty = availableStock - quantity;
            await existingInventory.save({ session });
          } else {
            const newInventory = new InventoryModel({
              productId,
              startdate: quotation.quoteDate,
              enddate: quotation.endDate,
              slot: slotName,
              reservedQty: quantity,
              availableQty: availableStock - quantity,
            });

            await newInventory.save({ session });
          }
        }
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: "Products added successfully to slots",
        data: updatedQuotation,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error adding products to slots:", error.message);
      return res
        .status(500)
        .json({ error: error.message || "Failed to add products to slots" });
    }
  }


// new code
async createQuotations(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
      const {
          clientId,
          quoteDate,
          endDate,
          quoteTime,
          clientName,
          clientNo,
          address,
          Products,
          category,
          status,
          GrandTotal,
          adjustments,
          discount,
          termsandCondition,
          GST,
          executivename,
          placeaddress,
          slots,
      } = req.body;

      console.log("🔄 Processing Quotation for slot:", quoteTime);

      // ✅ Convert date format to avoid RangeError
      const formattedQuoteDate = moment(quoteDate, "DD-MM-YYYY").format("DD-MM-YYYY");
      const formattedEndDate = moment(endDate, "DD-MM-YYYY").format("DD-MM-YYYY");

      // Generate unique quotation ID
      const latestQuotation = await Quotationmodel.findOne()
          .sort({ _id: -1 })
          .session(session);

      const nextQuoteId = latestQuotation
          ? `QT${(parseInt(latestQuotation.quoteId.replace("QT", ""), 10) + 1)
              .toString()
              .padStart(4, "0")}`
          : "QT0001";

      // 🔥 STEP 1: STRICT INVENTORY CHECK (NO NEGATIVE VALUES ALLOWED)
      for (const slot of slots) {
          const { Products, slotName } = slot; // Slot name from Enquiry

          for (const product of Products) {
              const { productId, quantity } = product;

              // ✅ Fetch product details
              const productData = await ProductModel.findById(productId).session(session).lean();
              if (!productData) throw new Error(`Product ${productId} not found.`);

              // ✅ Find all past reservations for this product and slot
              const existingReservations = await InventoryModel.find({
                  productId: productId,
                  slot: slotName,
                  startdate: { $lte: formattedEndDate },
                  enddate: { $gte: formattedQuoteDate },
              }).session(session);

              // ✅ Calculate total reserved quantity for overlapping bookings
              let totalReservedQty = existingReservations.reduce(
                  (sum, booking) => sum + booking.reservedQty,
                  0
              );

              // ✅ Compute the correct available stock
              let availableStock = productData.StockAvailable - totalReservedQty;

              // 🚨 **STRICT OVERBOOKING PREVENTION**
              if (availableStock < quantity) {
                  await session.abortTransaction();
                  session.endSession();
                  return res.status(400).json({
                      error: `❌ Booking Conflict: 
                      Product "${productData.ProductName}" is overbooked in Slot "${slotName}".
                      Available: ${availableStock}, Requested: ${quantity}, Reserved: ${totalReservedQty}.
                      🚫 No more bookings allowed for this slot.`
                  });
              }

              // ✅ Update or create inventory record
              let existingInventory = await InventoryModel.findOne({
                  productId,
                  startdate: formattedQuoteDate,
                  enddate: formattedEndDate,
                  slot: slotName
              }).session(session);

              if (existingInventory) {
                  existingInventory.reservedQty += quantity;
                  existingInventory.availableQty = availableStock - quantity;
                  await existingInventory.save({ session });
              } else {
                  const newInventory = new InventoryModel({
                      productId,
                      startdate: formattedQuoteDate,
                      enddate: formattedEndDate,
                      slot: slotName,
                      reservedQty: quantity,
                      availableQty: availableStock - quantity,
                  });

                  await newInventory.save({ session });
              }
          }
      }

      // 🔥 STEP 2: CREATE QUOTATION AFTER STOCK CONFIRMATION
      const newQuotation = new Quotationmodel({
          clientId,
          quoteId: nextQuoteId,
          clientName,
          Products,
          clientNo,
          address,
          category,
          quoteDate: formattedQuoteDate,
          quoteTime,
          termsandCondition,
          GrandTotal,
          adjustments,
          discount,
          GST,
          status,
          executivename,
          endDate: formattedEndDate,
          placeaddress,
          slots,
      });

      await newQuotation.save({ session });

      // ✅ Commit transaction after all checks pass
      await session.commitTransaction();
      session.endSession();

      return res.json({ success: "✅ Quotation confirmed and inventory locked successfully!" });

  } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("❌ Error in quotation creation:", error);
      return res.status(500).json({ error: error.message || "Failed to create Quotation" });
  }
}


  
}

const QuotationsController = new Quotations();
module.exports = QuotationsController;
