const KabkoModel = require('../models/kabkoModel');

const KabkoController = {
  // GET /kabkot
  index: async (req, res) => {
    try {
      const data = await KabkoModel.getAll();
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /kabkot/:id
  show: async (req, res) => {
    try {
      const data = await KabkoModel.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Kabupaten/Kota tidak ditemukan' });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /kabkot/by-provinsi?provinsi_id=1
  // Digunakan untuk AJAX dropdown (sama dengan route get-kabkot di Laravel)
  getByProvinsi: async (req, res) => {
    try {
      const { provinsi_id } = req.query;
      if (!provinsi_id) {
        return res.status(422).json({ success: false, message: 'provinsi_id wajib diisi' });
      }
      const data = await KabkoModel.getByProvinsiId(provinsi_id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /kabkot
  store: async (req, res) => {
    try {
      const { provinsi_id, nama_kabkot } = req.body;
      if (!provinsi_id || !nama_kabkot) {
        return res.status(422).json({ success: false, message: 'provinsi_id dan nama_kabkot wajib diisi' });
      }
      const data = await KabkoModel.create({ provinsi_id, nama_kabkot });
      res.status(201).json({ success: true, message: 'Kabupaten/Kota berhasil ditambahkan', data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // PUT /kabkot/:id
  update: async (req, res) => {
    try {
      const { provinsi_id, nama_kabkot } = req.body;
      if (!provinsi_id || !nama_kabkot) {
        return res.status(422).json({ success: false, message: 'provinsi_id dan nama_kabkot wajib diisi' });
      }
      const data = await KabkoModel.update(req.params.id, { provinsi_id, nama_kabkot });
      if (!data) return res.status(404).json({ success: false, message: 'Kabupaten/Kota tidak ditemukan' });
      res.json({ success: true, message: 'Kabupaten/Kota berhasil diperbarui', data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // DELETE /kabkot/:id
  destroy: async (req, res) => {
    try {
      const data = await KabkoModel.delete(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Kabupaten/Kota tidak ditemukan' });
      res.json({ success: true, message: 'Kabupaten/Kota berhasil dihapus' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = KabkoController;
