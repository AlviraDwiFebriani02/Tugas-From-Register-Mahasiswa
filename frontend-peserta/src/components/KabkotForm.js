'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createKabkot, updateKabkot, getProvinsi } from '../lib/api';

export default function KabkotForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [form, setForm] = useState({
    provinsi_id: initialData?.provinsi_id || '',
    nama_kabkot: initialData?.nama_kabkot || '',
  });
  const [provinsiList, setProvinsiList] = useState([]);
  const [loading, setLoading] = useState(false);

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

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.provinsi_id || !form.nama_kabkot.trim()) {
      alert('Provinsi dan nama kabupaten/kota wajib diisi');
      return;
    }

    setLoading(true);
    try {
      if (isEdit && initialData?.id) {
        await updateKabkot(initialData.id, form);
        alert('Kabupaten/Kota berhasil diperbarui');
      } else {
        await createKabkot(form);
        alert('Kabupaten/Kota berhasil ditambahkan');
      }
      router.push('/kabkot');
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
        <div>
          <label className={labelClass}>Provinsi</label>
          <select
            className={inputClass}
            name="provinsi_id"
            value={form.provinsi_id}
            onChange={handleChange}
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

        <div>
          <label className={labelClass}>Nama Kabupaten/Kota</label>
          <input
            className={inputClass}
            type="text"
            name="nama_kabkot"
            value={form.nama_kabkot}
            onChange={handleChange}
            placeholder="Contoh: Kabupaten Sidoarjo"
            required
          />
        </div>
      </div>

      <div className="flex gap-3">
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
