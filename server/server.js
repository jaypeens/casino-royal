// server.js

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const sequelize = require('./config/db');

const ownerRoutes = require('./routes/ownerRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

// Parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// Security headers with CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://cdn.pixabay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"]
    }
  }
}));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100                  // limit each IP to 100 requests
}));

// Serve static files from /public
app.use('/profile', profileRoutes);
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Sync database and start server
sequelize.sync()  // in dev: use force or alter; remove force in prod
  .then(() => {
    const PORT = process.env.PORT || 5000;
    
// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err.message);
  });
sequelize.sync({ alter: true }) // or just sequelize.sync()
  .then(() => {
    
// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.log("Failed to sync database:", err);
  });

app.use('/owner', ownerRoutes);
app.use('/admin', adminRoutes);