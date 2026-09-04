require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');
const path      = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ─────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Rate Limiting ──────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests. Please wait 15 minutes.' }
});
app.use('/api/contact', limiter);

// ─── API Routes ─────────────────────────────
app.use('/api/contact', require('./routes/contact'));

// ─── Serve Portfolio ────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start ──────────────────────────────────
// Vercel imports this file and calls the exported Express app directly as a
// serverless function — it does not need (or want) a listening port.
// Locally (npm start / npm run dev) we still want an actual HTTP server.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📬 Contact form ready — emails will be sent to ${process.env.EMAIL_TO}`);
  });
}

module.exports = app;