'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type CampaignOption = {
  id: string;
  name: string;
  empresaName: string;
};

export function CampaignPicker({
  campaigns,
  selectedId,
}: {
  campaigns: CampaignOption[];
  selectedId: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setCampaign(id: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (id) next.set('campanaId', id);
    else next.delete('campanaId');
    const qs = next.toString();
    router.push(qs ? `/admin/results?${qs}` : '/admin/results');
    router.refresh();
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-3">
      <div className="w-full sm:w-[420px]">
        <label className="block text-xs font-semibold text-slate-600 mb-1">Campaña</label>
        <select
          value={selectedId ?? ''}
          onChange={(e) => setCampaign(e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-[#dc9222]/25 focus:border-[#dc9222]"
        >
          <option value="">Seleccione una campaña…</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.empresaName} — {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

