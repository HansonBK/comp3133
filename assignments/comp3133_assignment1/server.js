import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();

app.use(express.json());

const db = async() =>  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/comp3133_101401959_Assignment1');




const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


try {
  await db();
  console.log('Connected to the database successfully');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

  });
} catch (error) {
  console.error('Database connection error:', error);
}


