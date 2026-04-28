'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProvinsi, updateProvinsi } from '../lib/api';

export default function ProvinsiForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [namaProvinsi, setNamaProvinsi] = useState(initialData?.nama_provinsi || '');
  const [loading, setLoading] = useState(false);

  const inputClass =
    'w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500';
  const labelClass = 'mb-1 block text-sm font-medium text-slate-700';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!namaProvinsi.trim()) {
      alert('Nama provinsi wajib diisi');
      return;
    }

    setLoading(true);
    try {
      if (isEdit && initialData?.id) {
        await updateProvinsi(initialData.id, namaProvinsi);
        alert('Provinsi berhasil diperbarui');
      } else {
        await createProvinsi(namaProvinsi);
        alert('Provinsi berhasil ditambahkan');
      }
      router.push('/provinsi');
      router.refresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
    >
      <div>
        <label className={labelClass}>Nama Provinsi</label>
        <input
          className={inputClass}
          type="text"
          value={namaProvinsi}
          onChange={(e) => setNamaProvinsi(e.target.value)}
          placeholder="Contoh: Jawa Timur"
          required
        />
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
