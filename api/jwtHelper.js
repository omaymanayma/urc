import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get the secret key from the environment
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;  // Ensures it's secure

if (!JWT_SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY is not defined in environment variables!');
}

// Function to generate JWT token
export const generateToken = (userId) => {
  const payload = {
    userId: userId,
    iat: Math.floor(Date.now() / 1000),  // issued at (current time)
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // expires in 1 hour
  };

  // Sign and return the JWT token
  return jwt.sign(payload, JWT_SECRET_KEY);
};
