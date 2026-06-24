const dns = require("node:dns");
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const express = require("express");
const dontenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { cursorTo } = require("node:readline");
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
    const userCollection = db.collection("user");
    const transactionCollection = db.collection("transactions");
    //profile update
    app.patch("/api/user", async (req, res) => {
      const { email, ...updatedData } = req.body;

      const result = await userCollection.updateOne(
        { email },
        { $set: updatedData },
      );

      res.send(result);
    });
    app.get("/api/user/:email", async (req, res) => {
      try {
        const email = req.params.email;

        const user = await userCollection.findOne({ email });

        return res.send(user); // MUST be user, not result
      } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Server error" });
      }
    });
    // startups related api(founder)
    app.post("/api/startups", async (req, res) => {
      const startup = {
        ...req.body,
        status: req.body.status || "pending",
        createdAt: new Date(),
      };
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

    //admin update startup status
    app.patch("/api/startups:id", async (req, res) => {
      const id = req.params.id;
      const updatedStartup = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: updatedStartup.status,
        },
      };
      const result = await startupCollection.updateOne(filter, updatedDoc);
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
    //get collaborator / founder all  applications
    app.get("/api/applications", async (req, res) => {
      const query = {};
      if (req.query.applicantEmail) {
        query.applicantEmail = req.query.applicantEmail;
      }
      if (req.query.founderEmail) {
        query.founderEmail = req.query.founderEmail;
      }
      const cursor = applicationCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //get all applications
    app.get("/api/applications", async (req, res) => {
      const result = await applicationCollection.find();
      res.send(result);
    });
    //get all users
    app.get("/api/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    //Transactions api
    // app.get("/api/transactions", async (req, res) => {
    //   const result = await transactionCollection.find().toArray();
    //   res.send(result);
    // });
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
