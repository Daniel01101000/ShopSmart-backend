import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Puedes agregar más campos, como edad, etc.
}, { timestamps: true });

export default mongoose.model('User', userSchema);