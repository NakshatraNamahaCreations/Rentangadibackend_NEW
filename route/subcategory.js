const express = require("express");
const router = express.Router();
const appsubcatcontroller = require("../controller/subcategory");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/subcategory");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/addappsubcat",
  upload.single("subcatimg"),
  appsubcatcontroller.addappsubcat
);
router.get("/getappsubcat", appsubcatcontroller.getappsubcat);
router.post("/postappsubcat", appsubcatcontroller.postappsubcat);
router.post("/deleteappsubcat/:id", appsubcatcontroller.deleteappsubcat);
router.put(
  "/editappsubcat/:id",
  upload.single("subcatimg"),
  appsubcatcontroller.editappsubcat
);

module.exports = router;
