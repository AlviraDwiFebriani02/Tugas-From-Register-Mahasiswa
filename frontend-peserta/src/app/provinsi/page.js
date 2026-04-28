import Link from 'next/link';
import { getProvinsi } from '../../lib/api';
import ProvinsiTable from '../../components/ProvinsiTable';

export default async function ProvinsiPage() {
  const data = await getProvinsi();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Daftar Provinsi</h2>
          <p className="text-sm text-slate-600">Kelola data provinsi.</p>
        </div>
        <Link
          href="/provinsi/tambah"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Tambah Provinsi
        </Link>
      </div>

      <ProvinsiTable data={data || []} />
    </section>
  );
}
