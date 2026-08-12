import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cartRoutes from './src/routes/cartRoutes.js';
import orderRoutes from './src/routes/ordersRoutes.js';


const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/v1/cart',cartRoutes);
app.use('/api/v1/orders',orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server is running on port${PORT}`);
});