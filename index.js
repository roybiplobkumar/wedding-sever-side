require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
// Initialize Express
const app = express();
const port = process.env.PORT || 5000;
// Middleware to parse JSON data
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
    const gelary = database.collection("gelary");
    //Define the route
    app.get("/", async (req, res) => {
      try {
        res.send("hellow biplob");
      } catch (err) {
        console.log(err);
      }
    });
    // Define the route
    app.post("/gelary", async (req, res) => {
      try {
        const data = req.body;
        const result = await gelary.insertMany([data]); // Insert an array of data
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
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
