'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  createPeserta,
  updatePeserta,
  getProvinsi,
  getKabkotByProvinsi,
} from '../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const AGAMA_OPTIONS = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];

export default function PesertaForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    nama: '',
    tempat: '',       // tempatLahir → field name di body: tempat
    tanggal: '',      // tanggalLahir → field name di body: tanggal
    agama: '',
    alamat: '',
    notelp: '',       // telepon → field name di body: notelp
    jk: '',           // 'Pria' | 'Wanita'
    provinsi_id: '',
    kabkot_id: '',
  });

  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabkotList, setKabkotList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load provinsi on mount
  useEffect(() => {
    async function loadProvinsi() {
      try {
        const data = await getProvinsi();
        setProvinsiList(data);
      } catch (error) {
        alert(error.message);
      }
    }
    loadProvinsi();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        nama: initialData.nama || '',
        tempat: initialData.tempatLahir || '',
        tanggal: initialData.tanggalLahir
          ? initialData.tanggalLahir.substring(0, 10)
          : '',
        agama: initialData.agama || '',
        alamat: initialData.alamat || '',
        notelp: initialData.telepon || '',
        jk: initialData.jenis_kelamin_label === 'Pria' ? 'Pria'
          : initialData.jenis_kelamin_label === 'Wanita' ? 'Wanita'
          : '',
        provinsi_id: initialData.provinsi_id?.toString() || '',
        kabkot_id: initialData.kabkot_id?.toString() || '',
      });

      // Set foto preview dari existing data
      if (initialData.foto) {
        setFotoPreview(`${API_URL}/storage/${initialData.foto}`);
      }

      // Load kabkot sesuai provinsi existing
      if (initialData.provinsi_id) {
        getKabkotByProvinsi(initialData.provinsi_id)
          .then(setKabkotList)
          .catch(() => {});
      }
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleProvinsiChange(e) {
    const provinsi_id = e.target.value;
    setForm((prev) => ({ ...prev, provinsi_id, kabkot_id: '' }));
    setKabkotList([]);

    if (!provinsi_id) return;

    try {
      const data = await getKabkotByProvinsi(provinsi_id);
      setKabkotList(data);
    } catch (error) {
      alert(error.message);
    }
  }

  function handleFotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Buat FormData karena ada upload foto
    const formData = new FormData();
    formData.append('nama', form.nama);
    formData.append('tempat', form.tempat);
    formData.append('tanggal', form.tanggal);
    formData.append('agama', form.agama);
    formData.append('alamat', form.alamat);
    formData.append('notelp', form.notelp);
    formData.append('jk', form.jk);
    formData.append('provinsi_id', form.provinsi_id);
    formData.append('kabkot_id', form.kabkot_id);
    if (fotoFile) {
      formData.append('foto', fotoFile);
    }

    setLoading(true);
    try {
      if (isEdit && initialData?.id) {
        await updatePeserta(initialData.id, formData);
        alert('Data peserta berhasil diperbarui');
      } else {
        await createPeserta(formData);
        alert('Data peserta berhasil ditambahkan');
      }
      router.push('/peserta');
      router.refresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500';
  const labelClass = 'mb-1 block text-sm font-medium text-slate-700';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Nama */}
        <div>
          <label className={labelClass}>Nama <span className="text-red-500">*</span></label>
          <input
            className={inputClass}
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Minimal 3 karakter"
            required
          />
        </div>

        {/* Tempat Lahir */}
        <div>
          <label className={labelClass}>Tempat Lahir <span className="text-red-500">*</span></label>
          <input
            className={inputClass}
            type="text"
            name="tempat"
            value={form.tempat}
            onChange={handleChange}
            placeholder="Contoh: Surabaya"
            required
          />
        </div>

        {/* Tanggal Lahir */}
        <div>
          <label className={labelClass}>Tanggal Lahir <span className="text-red-500">*</span></label>
          <input
            className={inputClass}
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            required
          />
        </div>

        {/* Agama */}
        <div>
          <label className={labelClass}>Agama <span className="text-red-500">*</span></label>
          <select
            className={inputClass}
            name="agama"
            value={form.agama}
            onChange={handleChange}
            required
          >
            <option value="">-- Pilih Agama --</option>
            {AGAMA_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className={labelClass}>Jenis Kelamin</label>
          <select
            className={inputClass}
            name="jk"
            value={form.jk}
            onChange={handleChange}
          >
            <option value="">-- Pilih --</option>
            <option value="Pria">Pria</option>
            <option value="Wanita">Wanita</option>
          </select>
        </div>

        {/* No. Telepon */}
        <div>
          <label className={labelClass}>No. Telepon</label>
          <input
            className={inputClass}
            type="text"
            name="notelp"
            value={form.notelp}
            onChange={handleChange}
            placeholder="Contoh: 081234567890"
          />
        </div>

        {/* Alamat */}
        <div className="md:col-span-2">
          <label className={labelClass}>Alamat</label>
          <textarea
            className={inputClass}
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            rows={3}
            placeholder="Alamat lengkap"
          />
        </div>

        {/* Provinsi */}
        <div>
          <label className={labelClass}>Provinsi <span className="text-red-500">*</span></label>
          <select
            className={inputClass}
            name="provinsi_id"
            value={form.provinsi_id}
            onChange={handleProvinsiChange}
            required
          >
            <option value="">-- Pilih Provinsi --</option>
            {provinsiList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama_provinsi}
              </option>
            ))}
          </select>
        </div>

        {/* Kabupaten/Kota */}
        <div>
          <label className={labelClass}>Kabupaten/Kota <span className="text-red-500">*</span></label>
          <select
            className={inputClass}
            name="kabkot_id"
            value={form.kabkot_id}
            onChange={handleChange}
            required
            disabled={kabkotList.length === 0}
          >
            <option value="">-- Pilih Kabupaten/Kota --</option>
            {kabkotList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama_kabkot}
              </option>
            ))}
          </select>
          {form.provinsi_id && kabkotList.length === 0 && (
            <p className="mt-1 text-xs text-slate-400">Memuat data kabkot...</p>
          )}
        </div>

        {/* Upload Foto */}
        <div className="md:col-span-2">
          <label className={labelClass}>Foto</label>
          <div className="flex items-start gap-4">
            {fotoPreview && (
              <img
                src={fotoPreview}
                alt="Preview foto"
                className="h-24 w-24 rounded-xl object-cover ring-1 ring-slate-200"
              />
            )}
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFotoChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100
                  file:px-4 file:py-2 file:text-sm file:font-medium
                  file:text-slate-700 hover:file:bg-slate-200"
              />
              <p className="mt-1 text-xs text-slate-400">
                Format: JPEG, PNG, GIF, WEBP. Maks 2MB.
                {isEdit && ' Kosongkan jika tidak ingin mengubah foto.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : isEdit ? 'Update' : 'Simpan'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-100"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
