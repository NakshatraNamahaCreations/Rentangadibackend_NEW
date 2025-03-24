const Clientmodel = require("../model/clients");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

class Clients {
  async createClients(req, res) {
    let {
      clientName,
      email,
      phoneNumber,
      // password,
      address,
      activeStatus,
      executives, 
    } = req.body;

    console.log( clientName,
      email,
      phoneNumber,
      // password,
      address,
      activeStatus,
      executives)
  
    try {
      // Check if client with the same phone number already exists
      const existingClient = await Clientmodel.findOne({ phoneNumber });
      if (existingClient) {
        return res.status(401).json({ error: "This number already exists!" });
      }
  
   
      let parsedExecutives = [];
      if (executives) {
        parsedExecutives = Array.isArray(executives)
          ? executives
          : JSON.parse(executives);
      }
  
      // Create a new client
      const newClient = new Clientmodel({
        clientName,
        email,
        // password,
      phoneNumber,
        address,
        activeStatus,
        executives: parsedExecutives, // Store executives array
      });
  
      // Save the client to the database
      const savedClient = await newClient.save();
  
      // Invalidate cache after adding a new client (if caching is used)
      if (cache) cache.del("allclients");
  
      return res.json({ success: "Client added successfully", client: savedClient });
    } catch (error) {
      console.error("Error creating client:", error);
      return res.status(500).json({ error: "Failed to add Client" });
    }
  }
  async clientlogin(req, res) {
    let { companyName, phoneNumber } = req.body;
  
    try {
      // Validate input
      if (!companyName || !phoneNumber) {
        return res.status(400).json({
          error: "Please enter company name, executive name, and executive phone number",
        });
      }
  
      // Find the client by company name
      const client = await Clientmodel.findOne({ clientName: companyName });
  
      if (!client) {
        return res.status(404).json({
          error: "Client not found. Please check your details",
        });
      }
  
      // Check if the executive exists in the client's executive list
      const executive = client.executives.find(
        (exec) =>  exec.phoneNumber === phoneNumber
      );
  
      if (!executive) {
        return res.status(404).json({
          error: "Executive not found. Please check your details",
        });
      }
  
      // Update the active status for the client
      await Clientmodel.findOneAndUpdate(
        { clientName: companyName },
        { activeStatus: "Online" },
        { new: true } 
      );
  
      // Update the active status for the specific executive
      await Clientmodel.updateOne(
        { clientName: companyName, "executives._id": executive._id },
        { $set: { "executives.$.activeStatus": "Online" } }
      );
  
      return res.status(200).json({
        success: "Login successful",
        client: {
          id: client._id,
          clientName: client.clientName,
          email: client.email,
          phoneNumber: client.phoneNumber,
          address: client.address,
          executive: {
            id: executive._id,
            name: executive.name,
            phoneNumber: executive.phoneNumber,
            activeStatus: "Online",
          },
        },
       
      });
    } catch (error) {
      console.error("Error during client login:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
  
  
  async editClients(req, res) {
    const ClientId = req.params.id;
    const {
      clientName,
      email,
      phoneNumber,
      address,
      executives, // Updated to include executives
    } = req.body;
  
    try {
      // Find the client by ID
      const findClients = await Clientmodel.findOne({ _id: ClientId });
      if (!findClients) {
        return res.status(404).json({ error: "No data found" });
      }
  
      // Update client fields conditionally
      findClients.clientName = clientName || findClients.clientName;
      findClients.email = email || findClients.email;
      findClients.phoneNumber = phoneNumber || findClients.phoneNumber;

      findClients.address = address || findClients.address;
  
      // Parse and update executives if provided
      if (executives) {
        const parsedExecutives = Array.isArray(executives)
          ? executives
          : JSON.parse(executives);
  
        findClients.executives = parsedExecutives;
      }
  
      // Save updated client
      const updatedData = await findClients.save();
  
      // Invalidate cache after updating the client
      if (cache) cache.del("allclients");
  
      return res.json({ success: "Client updated successfully", data: updatedData });
    } catch (error) {
      console.error("Error updating client:", error);
      return res.status(500).json({ error: "Unable to update the Client" });
    }
  }
  // async editClients(req, res) {
  //   const ClientId = req.params.id;
  //   const {
  //     clientName,
  //     email,
  //     phoneNumber,
  //     alternateNumber,
  //     password,
  //     address,
  //   } = req.body;

  //   try {
  //     const findClients = await Clientmodel.findOne({ _id: ClientId });
  //     if (!findClients) {
  //       return res.json({ error: "No data found" });
  //     }

  //     findClients.clientName = clientName || findClients.clientName;

  //     findClients.email = email || findClients.email;
  //     findClients.phoneNumber = phoneNumber || findClients.phoneNumber;
  //     findClients.alternateNumber =
  //       alternateNumber || findClients.alternateNumber;
  //     findClients.password = password || findClients.password;
  //     findClients.address = address || findClients.address;

  //     let updatedData = await Clientmodel.findOneAndUpdate(
  //       { _id: ClientId },
  //       findClients,
  //       { new: true }
  //     );

  //     if (updatedData) {
  //       // Invalidate cache after updating a Client
  //       cache.del("allclients");
  //       return res.json({ success: "Updated", data: updatedData });
  //     } else {
  //       return res.json({ error: "Update failed" });
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //     return res.status(500).json({ error: "Unable to update the Client" });
  //   }
  // }

  async getClients(req, res) {
    let cachedSubcategories = cache.get("allclients");
    if (cachedSubcategories) {
      return res.json({ Client: cachedSubcategories });
    } else {
      try {
        let Client = await Clientmodel.find({});
        if (Client) {
          cache.set("allclients", Client);
          return res.json({ Client: Client });
        } else {
          return res.status(404).json({ error: "No subcategories found" });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Failed to retrieve subcategories" });
      }
    }
  }

  async getTotalNumberOfClients(req, res) {
    try {
      // Use await correctly with the countDocuments() method
      let clientCount = await Clientmodel.countDocuments({});
      // Check if the count is not zero (though it would still return 0 if no documents are found)
      if (clientCount !== null) {
        return res.json({ clientCount: clientCount });
      } else {
        return res.status(404).json({ error: "No clients found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to retrieve client count" });
    }
  }

  async getClientsNames(req, res) {
    try {
      let Client = await Clientmodel.find({})
      if (Client) {
        return res.json({ ClientNames: Client });
      } else {
        return res.status(404).json({ error: "No subcategories found" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve subcategories" });
    }
  }

  async deleteClients(req, res) {
    let id = req.params.id;
    console.log("ID received in request:", id);

    try {
      let data = await Clientmodel.deleteOne({ _id: id });
      if (data.deletedCount > 0) {
        // Invalidate cache after deleting a Client
        cache.del("allclients");
        return res.json({ success: "Successfully deleted" });
      } else {
        return res.status(404).json({ error: "Client not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete Client" });
    }
  }
}

const ClientController = new Clients();
module.exports = ClientController;
