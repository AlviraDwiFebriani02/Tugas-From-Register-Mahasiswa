require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const provinsiRoutes = require('./routes/provinsiRoutes');
const kabkoRoutes    = require('./routes/kabkoRoutes');
const pesertaRoutes  = require('./routes/pesertaRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static: akses foto via URL, misal: GET /storage/uploads/foto/namafile.jpg
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/provinsi', provinsiRoutes);
app.use('/kabkot',   kabkoRoutes);
app.use('/peserta',  pesertaRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Project API berjalan 🚀' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
