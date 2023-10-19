import { MongoClient, ServerApiVersion } from 'mongodb';

async function connectDatabase() {
  const uri = "mongodb+srv://admin_0110:user0110@cluster0.tayhvzt.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    await client.close();
  }
}

export { connectDatabase }; // Export the connectDatabase function
