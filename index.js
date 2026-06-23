const dns = require("node:dns");
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const express = require("express");
const dontenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dontenv.config();

const uri = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL],
  }),
);
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const startupCollection = db.collection("startups");
    const opportunitieCollection = db.collection("opportunities");
    const applicationCollection = db.collection("applications");
    // startups related api(founder)
    app.post("/api/startups", async (req, res) => {
      const startup = req.body;
      const result = await startupCollection.insertOne(startup);
      res.send(result);
    });
    app.get("/api/startups", async (req, res) => {
      const query = {};
      if (req.query.founderEmail) {
        query.founderEmail = req.query.founderEmail;
      }
      const cursor = startupCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //borwse startups
    app.get("/api/startups", async (req, res) => {
      const result = await startupCollection.find();
      res.send(result);
    });
    // Update startup
    app.patch("/api/startups/:id", async (req, res) => {
      const { id } = req.params;
      const updatedStartups = req.body;
      const result = await startupCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updatedStartups } },
      );
      res.send(result);
    });
    //delete startup
    app.delete("/api/startups/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await startupCollection.deleteOne({
          _id: new ObjectId(id),
        });

        res.send(result);
      } catch (error) {
        res.status(500).send({
          message: "Failed to delete startup",
          error: error.message,
        });
      }
    });
    // Opportynity Updating
    app.patch("/api/opportunities/:id", async (req, res) => {
      const { id } = req.params;
      const updatedOpportunity = req.body;
      const result = await opportunitieCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updatedOpportunity } },
      );
      res.send(result);
    });
    // Delete opportunity
    app.delete("/api/opportunities/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await opportunitieCollection.deleteOne({
          _id: new ObjectId(id),
        });

        res.send(result);
      } catch (error) {
        res.status(500).send({
          message: "Failed to delete startup",
          error: error.message,
        });
      }
    });
    // Opportynity Posting
    app.post("/api/opportunities", async (req, res) => {
      const opportunity = req.body;
      const result = await opportunitieCollection.insertOne(opportunity);
      res.send(result);
    });
    app.get("/api/opportunities", async (req, res) => {
      const query = {};
      if (req.query.founderEmail) {
        query.founderEmail = req.query.founderEmail;
      }
      const cursor = opportunitieCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //browse opportunities
    app.get("/api/opportunities", async (req, res) => {
      const result = await opportunitieCollection.find();
      res.send(result);
    });
    //opportunity details
    app.get("/api/opportunities/:id", async (req, res) => {
      const { id } = req.params;
      const result = await opportunitieCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    // applications API
    app.post("/api/applications", async (req, res) => {
      const application = req.body;
      const newApplication = {
        ...application,
        createdAt: new Date(),
      };
      const result = await applicationCollection.insertOne(newApplication);
      res.send(result);
    });
    //get applications
    app.get("/api/applications", async (req, res) => {
      const query = {};
      if (req.query.applicantEmail) {
        query.applicantEmail = req.query.applicantEmail;
      }
      const cursor = applicationCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Start Up Forge!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
