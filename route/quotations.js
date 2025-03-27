const express = require("express");
const router = express.Router();
const QuotationsController = require("../controller/quotations");

router.post("/createQuotation", QuotationsController.createQuotations);
router.get(
  "/TotalNumberOfquotation",
  QuotationsController.getTotalAndTodayQuotationCount
);
router.get("/getallquotations", QuotationsController.allquotations);
router.post("/updatefollowup/:id", QuotationsController.updatequotefollowup);
router.post("/deletequotation/:id", QuotationsController.postdeletequotation);
router.get(
  "/getquotationaggbyid/:id",
  QuotationsController.getquotationaggredata
);
router.put('/updateQuotation', QuotationsController.updateQuotation);
router.post("/add-products", QuotationsController.addProductsToSlots);
router.post('/addontherproductsameslots', QuotationsController.addOntherProductsToSlots);
router.put('/updateQuotationquantity', QuotationsController.updateQuotation1);
router.post('/addontherproductsameslotstwo', QuotationsController.addOntherProductsToSlotstwo);
router.post('/addontherproductstoSlotsquotation', QuotationsController.addOntherProductsToSlotsQuotation);

module.exports = router;
