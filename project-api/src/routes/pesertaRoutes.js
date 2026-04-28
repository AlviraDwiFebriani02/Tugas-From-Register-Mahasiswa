const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const PesertaController = require('../controllers/pesertaController');

// Konfigurasi Multer untuk upload foto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../storage/uploads/foto'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extValid  = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);
  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error('File harus berupa gambar (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Maks 2MB (sesuai Laravel max:2048)
});

// GET    /peserta         - Daftar semua peserta
// POST   /peserta         - Tambah peserta baru (dengan upload foto)
// GET    /peserta/:id     - Detail peserta
// PUT    /peserta/:id     - Update peserta (dengan upload foto)
// DELETE /peserta/:id     - Hapus peserta

router.get('/',       PesertaController.index);
router.post('/',      upload.single('foto'), PesertaController.store);
router.get('/:id',    PesertaController.show);
router.put('/:id',    upload.single('foto'), PesertaController.update);
router.delete('/:id', PesertaController.destroy);

module.exports = router;
