import Redis from "ioredis";  // Import the ioredis library for Redis interaction.
import dotenv from "dotenv";  // Import dotenv to load environment variables from a .env file.

dotenv.config();  // Load the environment variables from the .env file.

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);  
// Initialize a new Redis client using the UPSTASH_REDIS_URL, 
// which is likely a Redis connection URL provided by Upstash (a serverless Redis provider).
