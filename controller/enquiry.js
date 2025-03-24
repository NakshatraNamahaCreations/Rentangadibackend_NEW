const mongoose = require("mongoose");
const Enquirymodel = require("../model/enquiry");
const Counter = require("../model/getNextSequence");
const Inventory = require("../model/inventory");

class Enquiry {
  async createEnquiry(req, res) {
    const {
      clientId,
      enquiryDate,
      enquiryTime,
      endDate,
      clientName,
      executivename,
      clientNo,
      address,
      products,
      category,
      status,
      GrandTotal,
      adjustments,
      discount,
      termsandCondition,
      GST,
      placeaddress,
    } = req.body;

    console.log(placeaddress);

    try {
      const latestCustomer = await Enquirymodel.findOne()
        .sort({ enquiryId: -1 })
        .exec();
      const latestEquiry = latestCustomer ? latestCustomer.enquiryId : 0;
      const newEquiry = latestEquiry + 1;
      const enquiryId = await Counter?.getNextSequence("enquiryId");
      // Create a new Enquiry with the incremented enquiryId
      const newEnquiry = new Enquirymodel({
        clientId,
        enquiryId,
        clientName,
        executivename,
        endDate,
        products,
        clientNo,
        address,
        category,
        enquiryDate,
        enquiryTime,
        termsandCondition,
        GrandTotal,
        adjustments,
        discount,
        GST,
        status,
        placeaddress,
      });

      // Save the new Enquiry to the database
      const savedEnquiry = await newEnquiry.save();

      if (savedEnquiry) {
        return res.json({ success: "Enquiry created successfully" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create Enquiry" });
    }
  }

  async updateEnquiries(req, res) {
    let { id } = req.params;
    let { GrandTotal, adjustments, discount, GST, hasBeenUpdated } = req.body;
    console.log(GrandTotal, adjustments, discount, GST);
    try {
      const enquiry = await Enquirymodel.findByIdAndUpdate({ _id: id });
      if (GrandTotal !== undefined) enquiry.GrandTotal = GrandTotal;
      if (adjustments !== undefined) enquiry.adjustments = adjustments;
      if (discount !== undefined) enquiry.discount = discount;
      if (GST !== undefined) enquiry.GST = GST;
      if (hasBeenUpdated !== undefined) enquiry.hasBeenUpdated = true;

      const updatedEnquiry = await enquiry.save();
      console.log(updatedEnquiry, "wrwwy9");
      return res
        .status(200)
        .json({ success: "Enquiry updated successfully", updatedEnquiry });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update Enquiry" });
    }
  }

  async getTotalAndTodayEnquiryCount(req, res) {
    try {
      // Get the current date and set the time to the start of the day
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Get the current date and set the time to the end of the day
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Count the total number of documents
      let totalEnquiryCount = await Enquirymodel.countDocuments({});

      // Count the number of documents created today
      let todayEnquiryCount = await Enquirymodel.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      return res.json({
        totalEnquiryCount: totalEnquiryCount,
        todayEnquiryCount: todayEnquiryCount,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve Enquiry counts" });
    }
  }

  async updateenquiryfollowup(req, res) {
    let { followupStatus } = req.body;
    let enquiryId = req.params.id;

    try {
      const enquiryData = await Enquirymodel.findOneAndUpdate(
        { _id: enquiryId },
        { followupStatus: followupStatus }
      );

      if (enquiryData) {
        return res.status(200).json({ success: "updated succesfully" });
      }
    } catch (error) {
      console.error("Something went wrong", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getEnquiryaggredata(req, res) {
    const id = req.params.id;

    try {
      const Data = await Enquirymodel.find({ _id: id });

      if (Data.length > 0) {
        return res.json({ EnquiryData: Data });
      } else {
        return res.status(404).json({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to retrieve data" });
    }
  }

  async allEnquiry(req, res) {
    try {
      const enquiryData = await Enquirymodel.find({}).sort({ _id: -1 });

      if (enquiryData) {
        return res.status(200).json({ enquiryData: enquiryData });
      }
    } catch (error) {
      console.error("Something went wrong", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async postdeleteEnquiry(req, res) {
    let id = req.params.id;
    try {
      const data = await Enquirymodel.deleteOne({ _id: id });
      if (data.deletedCount > 0) {
        return res.json({ success: "Successfully deleted" });
      } else {
        return res.status(404).json({ error: "Enquiry not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete Enquiry" });
    }
  }

  async updateEnquiry(req, res) {
    try {
      const id = req.params.id; // Extract enquiry ID from the URL
      const updateData = req.body; // Extract fields to update from the request body

      // Log received data for debugging
      console.log("Enquiry ID:", id);
      console.log("Update Data:", updateData);

      // Validate required fields
      if (!id) {
        return res.status(400).json({ error: "Enquiry ID is required" });
      }

      // Perform the update operation
      const updatedEnquiry = await Enquirymodel.findOneAndUpdate(
        { _id: id }, // Query condition: Match by ID
        updateData, // Update operation: Use the received fields to update
        { new: true } // Return the updated document
      );

      if (updatedEnquiry) {
        return res.status(200).json({
          success: true,
          message: "Enquiry updated successfully",
          enquiry: updatedEnquiry,
        });
      } else {
        return res.status(404).json({ error: "Enquiry not found" });
      }
    } catch (error) {
      console.error("Error in updateEnquiry:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async addProductsToEnquiry(req, res) {
    const { id, products, adjustment = 0 } = req.body;
    console.log(req.body, "Request Body");

    try {
      // Find the enquiry by clientId
      const enquiry = await Enquirymodel.findOne({ enquiryId: id });

      if (!enquiry) {
        return res.status(404).json({ error: "Enquiry not found" });
      }

      // Validate products array
      if (!Array.isArray(products) || products.length === 0) {
        return res
          .status(400)
          .json({ error: "Products must be a non-empty array" });
      }

      // Append new products to the existing products array
      enquiry.products = [...(enquiry.products || []), ...products];

      // Calculate the new grand total
      const productTotal = enquiry.products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );
      const updatedGrandTotal = Math.max(0, productTotal - adjustment);

      // Update enquiry fields
      enquiry.grandTotal = updatedGrandTotal;
      enquiry.adjustment = adjustment;

      // Save the updated enquiry
      const updatedEnquiry = await enquiry.save();
      console.log(updatedEnquiry, "Updated Enquiry");

      return res.status(200).json({
        success: "Products added successfully",
        data: updatedEnquiry,
      });
    } catch (error) {
      console.error("Error adding products to enquiry:", error.message);
      return res
        .status(500)
        .json({ error: "Failed to add products to Enquiry" });
    }
  }

  async updateProductData(req, res) {
    const { id } = req.params; // Enquiry ID
    const { productId, quantity } = req.body; // Product ID and updated quantity

    try {
        // Find the enquiry document
        const enquiry = await Enquirymodel.findOne({ _id: id });

        if (!enquiry) {
            return res.status(404).json({ error: "Enquiry not found" });
        }

        // Find the product in the products array
        const productIndex = enquiry.products.findIndex(
            (product) => product.productId === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({ error: "Product not found in enquiry" });
        }

        // Update quantity and total for the selected product
        enquiry.products[productIndex].quantity = quantity;
        enquiry.products[productIndex].total =
            quantity * enquiry.products[productIndex].price;

        // Recalculate GrandTotal (sum of all product totals)
        const newGrandTotal = enquiry.products.reduce(
            (sum, product) => sum + product.total,
            0
        );

        // Update the document in the database
        const updatedEnquiry = await Enquirymodel.findOneAndUpdate(
            { _id: id, "products.productId": productId },
            {
                $set: {
                    "products.$.quantity": quantity,
                    "products.$.total": quantity * enquiry.products[productIndex].price,
                    "GrandTotal": newGrandTotal
                }
            },
            { new: true } // Return the updated document
        );

        return res.status(200).json({
            success: "Product quantity and GrandTotal updated successfully",
            data: updatedEnquiry,
        });

    } catch (error) {
        console.error("Error updating products in enquiry:", error.message);
        return res
            .status(500)
            .json({ error: "Failed to update product in Enquiry" });
    }
}


async deleteProductFromEnquiry(req, res) {
  const { id } = req.params; 
  const { productId } = req.body; 
  console.log(productId,"productId")

  try {
      // Find the enquiry document
      const enquiry = await Enquirymodel.findOne({ _id: id });

      if (!enquiry) {
          return res.status(404).json({ error: "Enquiry not found" });
      }

   const updatedProducts = enquiry.products.filter(
          (product) => product.productId !== productId
      );

      if (updatedProducts.length === enquiry.products.length) {
          return res.status(404).json({ error: "Product not found in enquiry" });
      }

      const newGrandTotal = updatedProducts.reduce(
          (sum, product) => sum + product.total,
          0
      );

      // Update the enquiry document
      const updatedEnquiry = await Enquirymodel.findOneAndUpdate(
          { _id: id },
          {
              $set: {
                  products: updatedProducts,
                  GrandTotal: newGrandTotal
              }
          },
          { new: true } // Return the updated document
      );

      return res.status(200).json({
          success: "Product removed successfully",
          data: updatedEnquiry,
      });

  } catch (error) {
      console.error("Error removing product from enquiry:", error.message);
      return res
          .status(500)
          .json({ error: "Failed to remove product from enquiry" });
  }
}


async addProductToEnquiry(req, res) {
  const { id } = req.params; 
  const { productId, productName, quantity, price ,StockAvailable} = req.body;
  console.log(price,"price")
console.log("id not fount");
  try {
      const enquiry = await Enquirymodel.findOne({ _id: id });

      if (!enquiry) {
          return res.status(404).json({ error: "Enquiry not found" });
      }

      const existingProduct = enquiry.products.find(
          (product) => product.productId === productId
      );

      if (existingProduct) {
          return res.status(400).json({ error: "Product already exists in enquiry" });
      }
      const numericPrice = Number(price) || 0;
      const numericQuantity = Number(quantity) || 0;
      const totalPrice = numericPrice * numericQuantity;

      const newProduct = {
          productId,
          productName,
          quantity: numericQuantity, // ✅ Ensure numeric value
          price: numericPrice,  
          total: totalPrice,
          StockAvailable,
      };

      // Push the new product into the products array
      enquiry.products.push(newProduct);

      // Recalculate GrandTotal (sum of all product totals)
      const newGrandTotal = enquiry.products.reduce(
          (sum, product) => sum + product.total,
          0
      );

      // Update the enquiry document
      const updatedEnquiry = await Enquirymodel.findOneAndUpdate(
          { _id: id },
          {
              $set: { GrandTotal: newGrandTotal },
              $push: { products: newProduct }, // Add the new product to the array
          },
          { new: true } // Return the updated document
      );

      return res.status(200).json({
          success: "New product added successfully and GrandTotal updated",
          data: updatedEnquiry,
      });

  } catch (error) {
      console.error("Error adding product to enquiry:", error.message);
      return res.status(500).json({ error: "Failed to add product to enquiry" });
  }
}



}

const EnquiryController = new Enquiry();
module.exports = EnquiryController;
