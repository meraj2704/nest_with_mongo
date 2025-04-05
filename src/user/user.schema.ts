import { Schema, Document } from 'mongoose'; // Import Schema and Document from mongoose

// Define the User Schema
export const userSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

// Define the User Interface
export interface User extends Document {
  id: string;
  name: string;
  age: number;
}
