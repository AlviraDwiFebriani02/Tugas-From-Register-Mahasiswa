const PesertaModel = require('../models/pesertaModel');
const fs = require('fs');
const path = require('path');

// Folder penyimpanan foto
const FOTO_DIR = path.join(__dirname, '../storage/uploads/foto');

const PesertaController = {
  // GET /peserta
  index: async (req, res) => {
    try {
      const data = await PesertaModel.getAll();
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /peserta/:id
  show: async (req, res) => {
    try {
      const data = await PesertaModel.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Peserta tidak ditemukan' });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /peserta
  store: async (req, res) => {
    try {
      const { nama, tempat, tanggal, agama, alamat, notelp, jk, provinsi_id, kabkot_id } = req.body;

      // Validasi wajib
      const errors = [];
      if (!nama || nama.length < 3) errors.push('nama wajib diisi minimal 3 karakter');
      if (!tempat)      errors.push('tempat lahir wajib diisi');
      if (!tanggal)     errors.push('tanggal lahir wajib diisi');
      if (!agama)       errors.push('agama wajib diisi');
      if (!provinsi_id) errors.push('provinsi_id wajib diisi');
      if (!kabkot_id)   errors.push('kabkot_id wajib diisi');
      if (errors.length) {
        // Hapus foto yang sudah terupload jika validasi gagal
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(422).json({ success: false, errors });
      }

      // Konversi jenis kelamin
      const jkValue = jk === 'Pria' ? 0 : jk === 'Wanita' ? 1 : null;

      // Path foto
      const fotoPath = req.file ? `uploads/foto/${req.file.filename}` : null;

      const data = await PesertaModel.create({
        nama,
        tempatLahir:  tempat,
        tanggalLahir: tanggal,
        agama,
        alamat,
        telepon:    notelp,
        jk:         jkValue,
        foto:       fotoPath,
        provinsi_id,
        kabkot_id,
      });

      res.status(201).json({ success: true, message: 'Data peserta berhasil disimpan!', data });
    } catch (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // PUT /peserta/:id
  update: async (req, res) => {
    try {
      const existing = await PesertaModel.getById(req.params.id);
      if (!existing) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ success: false, message: 'Peserta tidak ditemukan' });
      }

      const { nama, tempat, tanggal, agama, alamat, notelp, jk, provinsi_id, kabkot_id } = req.body;

      // Validasi wajib
      const errors = [];
      if (!nama || nama.length < 3) errors.push('nama wajib diisi minimal 3 karakter');
      if (!tempat)      errors.push('tempat lahir wajib diisi');
      if (!tanggal)     errors.push('tanggal lahir wajib diisi');
      if (!agama)       errors.push('agama wajib diisi');
      if (!provinsi_id) errors.push('provinsi_id wajib diisi');
      if (!kabkot_id)   errors.push('kabkot_id wajib diisi');
      if (errors.length) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(422).json({ success: false, errors });
      }

      // Konversi jenis kelamin
      const jkValue = jk === 'Pria' ? 0 : jk === 'Wanita' ? 1 : null;

      // Handle foto baru: hapus foto lama jika ada
      let fotoPath = existing.foto;
      if (req.file) {
        if (fotoPath) {
          const oldPath = path.join(__dirname, '../storage', fotoPath);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        fotoPath = `uploads/foto/${req.file.filename}`;
      }

      const data = await PesertaModel.update(req.params.id, {
        nama,
        tempatLahir:  tempat,
        tanggalLahir: tanggal,
        agama,
        alamat,
        telepon:    notelp,
        jk:         jkValue,
        foto:       fotoPath,
        provinsi_id,
        kabkot_id,
      });

      res.json({ success: true, message: 'Data peserta berhasil diperbarui!', data });
    } catch (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // DELETE /peserta/:id
  destroy: async (req, res) => {
    try {
      const existing = await PesertaModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Peserta tidak ditemukan' });

      // Hapus foto dari storage jika ada
      if (existing.foto) {
        const fotoPath = path.join(__dirname, '../storage', existing.foto);
        if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
      }

      await PesertaModel.delete(req.params.id);
      res.json({ success: true, message: 'Data peserta berhasil dihapus!' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = PesertaController;
