import Link from 'next/link';
import { getKabkot } from '../../lib/api';
import KabkotTable from '../../components/KabkotTable';

export default async function KabkotPage() {
  const data = await getKabkot();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Daftar Kabupaten/Kota</h2>
          <p className="text-sm text-slate-600">Kelola data kabupaten dan kota.</p>
        </div>
        <Link
          href="/kabkot/tambah"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Tambah Kabupaten/Kota
        </Link>
      </div>

      <KabkotTable data={data || []} />
    </section>
  );
}
