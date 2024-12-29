require("dotenv").config();
const express = require("express");
var cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// Initialize Express
const app = express();
const port = process.env.PORT || 5000;
// Middleware to parse JSON data
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ifoquc5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("Wedding_DB");
    const gallery = database.collection("gallery");
    const service = database.collection("service");
    const blog = database.collection("blog");
    // get all blog route
    app.get("/blog", async (req, res) => {
      try {
        const blogData = await blog.find().toArray();
        console.log(blogData);

        res.send(blogData);
      } catch (ere) {
        console.log(err);
      }
    });

    //get all services route
    app.get("/services", async (req, res) => {
      try {
        const servicesdata = await service.find().toArray();
        res.send(servicesdata);
      } catch (err) {
        console.log(err);
      }
    });

    // get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await service.findOne(query);
      res.send(result);
    });
    // get single blog
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blog.findOne(query);
      res.send(result);
    });
    //Define the route
    app.get("/", async (req, res) => {
      try {
        res.send("hellow biplob");
      } catch (err) {
        console.log(err);
      }
    });
    // Define the route
    app.post("/gallery", async (req, res) => {
      try {
        const data = req.body;
        const result = await gallery.insertOne(data); // Insert an array of data
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });
    // Define the route

    app.post("/add-service", async (req, res) => {
      try {
        const data = req.body;

        // Validate required fields
        if (!data.title || !data.description || !data.price) {
          return res.status(400).send({ error: "All fields are required." });
        }

        // Ensure price is a positive number
        if (data.price < 0) {
          return res
            .status(400)
            .send({ error: "Price must be a positive number." });
        }

        // Insert data into the 'services' collection
        const result = await service.insertOne(data);

        res.status(201).send({
          message: "Service added successfully!",
          result,
        });
      } catch (error) {
        console.error("Error adding service:", error.message);
        res
          .status(500)
          .send({ error: "Failed to add service. Please try again." });
      }
    });

    // addting route
    app.post("/add-blog", async (req, res) => {
      try {
        const blogData = req.body;
        const result = await blog.insertOne(blogData);
        res.status(201).send({
          data: result,
          message: "blog data successfuly inserted",
        });
      } catch (err) {
        console.log(err);
      }
    });

    // udate sevices route
    app.put("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const {_id,...udatedData}=req.body
      const updatedDoc = {
        $set: udatedData,
      };

      const result = await service.updateOne(
        filter,
        updatedDoc,
        options
      );

      res.send(result);
    });
    // udate blog route
    app.put("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const {_id,...udatedData}=req.body
      const updatedDoc = {
        $set: udatedData,
      };

      const result = await blog.updateOne(
        filter,
        updatedDoc,
        options
      );

      res.send(result);
    });


    // delete sevice route 
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await service.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).send({ message: "Failed to delete service" });
      }
    });
    // delete blog route 
    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await blog.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).send({ message: "Failed to delete service" });
      }
    });
    

    // running port
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch {
    console.log("server crush ");
  }
}

run().catch(console.dir);
