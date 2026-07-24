const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://content-management-system-pvc8.vercel.app/',  // your admin URL
        'https://content-management-system-7c5s.vercel.app/'          // your public URL
    ]
}));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/content', contentRoutes);

app.use(errorHandler);

// Only listen locally — Vercel handles invocation itself in production
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;