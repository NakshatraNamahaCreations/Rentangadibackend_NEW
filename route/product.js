const express = require("express");
const router = express.Router();
const ProductManagemntController = require("../controller/product");

const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/product");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/addProducts",
  upload.any(""),
  ProductManagemntController.addProductManagement
);
router.get("/getProducts", ProductManagemntController.getProductManagement);
router.get(
  "/getProductsInventory",
  ProductManagemntController.getProductforInventory
);
router.post(
  "/editProducts/:id",
  ProductManagemntController.editProductManagement
);

router.post(
  "/deleteProducts/:id",
  ProductManagemntController.postdeleteProductManagement
);
router.post("/postsubcatProduct", ProductManagemntController.postsubcategory);

// 27-09
router.post(
  "/getProductbycategory",
  ProductManagemntController.getProductByCategory
);
router.get(
  "/TotalNumberOfProduct",
  ProductManagemntController.getTotalNumberOfProduct
);

router.put(
  "/updateProducts/:id",
  upload.single("ProductIcon"),
  ProductManagemntController.updateProducts
);

router.post(
  "/updateenabledisble/:id",
  ProductManagemntController.activeStatusenble
);

router.get("/quoteproducts", ProductManagemntController.quoteProduct);
router.get(
  "/getinventoryproducts",
  ProductManagemntController.getaggregetinventory
);

router.get("/products-with-inventory", ProductManagemntController.getProductsWithInventory);
router.post("/bulkuploadproduct",ProductManagemntController.addServicesViaExcel)


module.exports = router;
