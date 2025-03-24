const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema(
  {
    enquiryId: { type: Number, unique: true, required: true },
    enquiryDate: {
      type: String,
      require: true,
    },
    endDate: {
      type: String,
      require: true,
    },
    enquiryTime: {
      type: String,
      require: true,
    },
    clientId: {
      type: String,
      require: true,
    },
    clientName: {
      type: String,
      require: true,
    },
    executivename: {
      type: String,
      require: true,
    },
    products: {
      type: Array,
    },
    workerAmt: {
      type: Number,
    },
    category: {
      type: String,
      require: true,
    },
    followupStatus: {
      type: String,
      default: "",
    },
    GST: {
      type: Number,
    },
    GrandTotal: {
      type: Number,
      require: true,
    },
    
    adjustments: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    status: {
      type: String,
      default: "not send",
      enum: ["not send", "sent"],
    },
    termsandCondition: {
      type: Array,
    },
    clientNo: {
      type: String,
    },
    address: {
      type: String,
    },
    placeaddress: {
      type: String,
    },
    hasBeenUpdated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Enquirymodel = mongoose.model("Enquiry", EnquirySchema);
module.exports = Enquirymodel;
