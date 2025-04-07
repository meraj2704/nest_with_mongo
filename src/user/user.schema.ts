import { Schema, Document } from 'mongoose'; // Import Schema and Document from mongoose

// Define the User Schema
export const userSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user', 'guest', 'moderator', 'super_admin'],
      default: 'user',
    },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true },
);

// Define the User Interface
export interface User extends Document {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  role: string;
  refreshToken: string;
}
