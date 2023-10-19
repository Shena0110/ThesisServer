import { MongoClient } from 'mongodb';

async function connectDatabase() {
  const uri = "mongodb+srv://admin_0110:user0110@cluster0.tayhvzt.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    // Access your database and perform operations here
    const database = client.db('<databaseName>'); // Replace '<databaseName>' with your actual database name

    // Example: List collections in the database
    const collections = await database.listCollections().toArray();
    console.log('Collections in the database:', collections);

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    await client.close();
  }
}

export { connectDatabase };
