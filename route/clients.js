const express = require("express");
const router = express.Router();
const ClientController = require("../controller/clients");

router.post("/addClients", ClientController.createClients);
router.get("/getallClients", ClientController.getClients);
router.get("/TotalNumberOfClients", ClientController.getTotalNumberOfClients);
router.get("/getallClientsNames", ClientController.getClientsNames);
router.delete("/deleteClients/:id", ClientController.deleteClients);
router.post("/clientlogin", ClientController.clientlogin);

router.put(
  "/editClient/:id",
  ClientController.editClients
);

module.exports = router;
