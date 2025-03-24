const Payment = require("../model/payment"); 

// Controller to create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { quotationId, totalAmount, advancedAmount, paymentMode,status,paymentRemarks,comment } = req.body;
console.log(quotationId, totalAmount, advancedAmount, paymentMode,paymentRemarks,comment)


    // Create a new payment document
    const payment = new Payment({
      quotationId,
      totalAmount,
      advancedAmount,
      paymentMode,
      status,
      paymentRemarks,
      comment
    });

    // Save the payment to the database
    const savedPayment = await payment.save();
    res.status(200).json({message:"Successfully",savedPayment});
  } catch (error) {
    res.status(500).json({ message: "Error creating payment", error: error.message });
  }
};
// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("quotationId");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};

// Get a payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById({id:id}).populate("quotationId");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment", error: error.message });
  }
};

// Controller to delete a payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the payment by ID
    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment deleted successfully", deletedPayment });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error: error.message });
  }
};

