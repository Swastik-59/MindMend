import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db = null;

async function connectDB() {
    try {
        await client.connect();
        db = client.db(); 
        await db.command({ ping: 1 });
        console.log("MongoDB connected!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export { connectDB, db, client };