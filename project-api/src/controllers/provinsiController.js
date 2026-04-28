const ProvinsiModel = require('../models/provinsiModel');

const ProvinsiController = {
  // GET /provinsi
  index: async (req, res) => {
    try {
      const data = await ProvinsiModel.getAll();
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /provinsi/:id
  show: async (req, res) => {
    try {
      const data = await ProvinsiModel.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Provinsi tidak ditemukan' });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /provinsi
  store: async (req, res) => {
    try {
      const { nama_provinsi } = req.body;
      if (!nama_provinsi) {
        return res.status(422).json({ success: false, message: 'nama_provinsi wajib diisi' });
      }
      const data = await ProvinsiModel.create({ nama_provinsi });
      res.status(201).json({ success: true, message: 'Provinsi berhasil ditambahkan', data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // PUT /provinsi/:id
  update: async (req, res) => {
    try {
      const { nama_provinsi } = req.body;
      if (!nama_provinsi) {
        return res.status(422).json({ success: false, message: 'nama_provinsi wajib diisi' });
      }
      const data = await ProvinsiModel.update(req.params.id, { nama_provinsi });
      if (!data) return res.status(404).json({ success: false, message: 'Provinsi tidak ditemukan' });
      res.json({ success: true, message: 'Provinsi berhasil diperbarui', data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // DELETE /provinsi/:id
  destroy: async (req, res) => {
    try {
      const data = await ProvinsiModel.delete(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Provinsi tidak ditemukan' });
      res.json({ success: true, message: 'Provinsi berhasil dihapus' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = ProvinsiController;
