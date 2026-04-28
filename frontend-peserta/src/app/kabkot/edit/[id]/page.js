import { getKabkotById } from '../../../../lib/api';
import KabkotForm from '../../../../components/KabkotForm';

export default async function EditKabkotPage({ params }) {
  const { id } = await params;
  const data = await getKabkotById(id);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Edit Kabupaten/Kota</h2>
        <p className="text-sm text-slate-600">
          Ubah data kabupaten/kota yang sudah ada.
        </p>
      </div>
      <KabkotForm initialData={data} isEdit={true} />
    </section>
  );
}
