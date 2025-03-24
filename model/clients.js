const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      require: true,
    },
    executives: [
      {
        name: {
          type: String,
          required: true,
        },
        phoneNumber: {
          type: String,
          required: true,
        },
      },
    ],
    email: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    activeStatus: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Clientmodel = mongoose.model("client", ClientSchema);
module.exports = Clientmodel;
