import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import emailLabelRoutes from './routes/emailLabelRoutes.js';
import inboxRoutes from './routes/inboxRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import recipientsRoutes from './routes/recipientsRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({
    message: "✅ Larkon Backend Running"
  });
});

// API Routes - Version 1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/emails', emailRoutes);
app.use('/api/v1/email-labels', emailLabelRoutes);
app.use('/api/v1/inbox', inboxRoutes);
app.use('/api/v1/calendar', calendarRoutes);
app.use('/api/v1/recipients', recipientsRoutes);

export default app;