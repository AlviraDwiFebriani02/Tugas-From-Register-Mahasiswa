import { getProvinsiById } from '../../../../lib/api';
import ProvinsiForm from '../../../../components/ProvinsiForm';

export default async function EditProvinsiPage({ params }) {
  const { id } = await params;
  const data = await getProvinsiById(id);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Edit Provinsi</h2>
        <p className="text-sm text-slate-600">
          Ubah data provinsi yang sudah ada.
        </p>
      </div>
      <ProvinsiForm initialData={data} isEdit={true} />
    </section>
  );
}
