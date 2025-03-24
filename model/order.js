const mongoose = require("mongoose");


const SlotSchema = new mongoose.Schema({
  slotName: {
    type: String,
    required: true,
  },
  quoteDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
});

const orderSchema = new mongoose.Schema(
  {
    ClientId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Client", 
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientNo: {
      type: String,
      required: true,
    },
    placeaddress:{
      type:String,
    },
    executivename: {
      type: String,
      require: true,
    },
    // startDate: {
    //   type: String,
    //   required: true,
    // },
    // endDate: {
    //   type: String,
    //   required: true,
    // },
    slots: {
      type: [SlotSchema], // Array of slots with associated products
      required: true,
    },
    products: [
      {
        productId: {
          type: String, 
        },
        productName: {
          type: String, 
          ref: "Product", 
          // required: true,
        },
        quantity: {
          type: Number,
          // required: true,
        },
        total: {
          type: Number,
          // required: true,
        },
      },
    ],
    Address: {
      type: Object,
      required: true,
    },
    GrandTotal: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"], // Ensures only valid statuses
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Confirm", "Approved", "Completed", "Cancelled"], // Ensures only valid statuses
      default: "Confirm",
    },
    productrefurbishment:{
      type: Array,
    },
    damagerefurbishment:{
      type:String,
    },
    shippingaddressrefurbishment:{
      type:String,
    },
    expense :{
      type: Number,
    },
    floormanager:{
      type:String,
    },
    labourecharge: { type: Number, default: 0 }, 
    transportcharge: { type: Number, default: 0 },
    discount: {
      type: Number,
    },
    GST: {
      type: Number,
    },
    adjustments:{
      type: Number,
    },
    
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
