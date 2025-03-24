const mongoose = require("mongoose");


const SlotSchema = new mongoose.Schema({
  slotName: {
    type: String,
    required: true, 
  },
  quoteDate: {
    type: String,
    require: true,
  },
  endDate: {
    type: String,
    require: true,
  },
  Products: {
    type: Array, 
  },
});
const QuotationSchema = new mongoose.Schema({
  quoteId: {
    type: String,
    require: true,
  },
  quoteDate: {
    type: String,
    require: true,
  },
  endDate: {
    type: String,
    require: true,
  },
  quoteTime: {
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
  // Products: {
  //   type: Array,
  // },
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
    enum: ["pending", "send"],
    default: "pending",
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
  labourecharge: { type: Number, default: 0 }, 
  transportcharge: { type: Number, default: 0 },
  placeaddress:{
    type:String
  },
  slots: {
    type: [SlotSchema], // Array of slots
  },
}, { timestamps: true });

const Quotationmodel = mongoose.model("Quotation", QuotationSchema);
module.exports = Quotationmodel;
