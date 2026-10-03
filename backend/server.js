import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productsRoutes.js';
dotenv.config();
import cartRoutes from './routes/cart.js';
import addressRoutes from './routes/address.js';
import OrderRoutes from './routes/order.js';

const app = express();

app.use(cors())
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/order',OrderRoutes)


app.get('/', (req, res) => {
    res.send('API is running...');
});


connectDB();

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});





