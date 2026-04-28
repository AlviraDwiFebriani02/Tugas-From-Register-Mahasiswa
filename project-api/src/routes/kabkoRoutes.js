const express = require('express');
const router = express.Router();
const KabkoController = require('../controllers/kabkoController');

// GET    /kabkot                          - Daftar semua kabkot
// GET    /kabkot/by-provinsi?provinsi_id= - Kabkot berdasarkan provinsi (AJAX dropdown)
// POST   /kabkot                          - Tambah kabkot baru
// GET    /kabkot/:id                      - Detail kabkot
// PUT    /kabkot/:id                      - Update kabkot
// DELETE /kabkot/:id                      - Hapus kabkot

// PENTING: route statis harus di atas route dinamis /:id
router.get('/by-provinsi', KabkoController.getByProvinsi);

router.get('/',       KabkoController.index);
router.post('/',      KabkoController.store);
router.get('/:id',    KabkoController.show);
router.put('/:id',    KabkoController.update);
router.delete('/:id', KabkoController.destroy);

module.exports = router;
