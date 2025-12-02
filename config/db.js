import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.DB_URL;
    if (!uri) throw new Error("Missing DB_URL");

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;