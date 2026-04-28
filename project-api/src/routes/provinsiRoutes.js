const express = require('express');
const router = express.Router();
const ProvinsiController = require('../controllers/provinsiController');

// GET    /provinsi         - Daftar semua provinsi
// POST   /provinsi         - Tambah provinsi baru
// GET    /provinsi/:id     - Detail provinsi
// PUT    /provinsi/:id     - Update provinsi
// DELETE /provinsi/:id     - Hapus provinsi

router.get('/',     ProvinsiController.index);
router.post('/',    ProvinsiController.store);
router.get('/:id',  ProvinsiController.show);
router.put('/:id',  ProvinsiController.update);
router.delete('/:id', ProvinsiController.destroy);

module.exports = router;
