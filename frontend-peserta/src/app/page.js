export default function HomePage() {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-3 text-3xl font-bold text-slate-900">
        Aplikasi CRUD Project API
      </h2>
      <p className="text-slate-600">
        Frontend ini dibuat dengan Next.js App Router dan Tailwind CSS, terhubung ke backend
        Node.js + Express + PostgreSQL. Kelola data Peserta, Provinsi, dan Kabupaten/Kota.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <a href="/peserta" className="block rounded-xl bg-slate-900 px-4 py-4 text-white hover:bg-slate-700 transition-colors">
          <div className="text-lg font-semibold">Peserta</div>
          <div className="text-sm text-slate-400 mt-1">Kelola data peserta</div>
        </a>
        <a href="/provinsi" className="block rounded-xl bg-blue-600 px-4 py-4 text-white hover:bg-blue-700 transition-colors">
          <div className="text-lg font-semibold">Provinsi</div>
          <div className="text-sm text-blue-200 mt-1">Kelola data provinsi</div>
        </a>
        <a href="/kabkot" className="block rounded-xl bg-emerald-600 px-4 py-4 text-white hover:bg-emerald-700 transition-colors">
          <div className="text-lg font-semibold">Kabupaten/Kota</div>
          <div className="text-sm text-emerald-200 mt-1">Kelola data kabkot</div>
        </a>
      </div>
    </section>
  );
}
