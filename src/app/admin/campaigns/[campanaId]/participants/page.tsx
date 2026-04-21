import CampaignParticipantsClient from './CampaignParticipantsClient';

export const dynamic = 'force-dynamic';

export default async function CampaignParticipantsPage({ params }: { params: Promise<{ campanaId: string }> }) {
  const { campanaId } = await params;
  return (
    <div className="space-y-6">
      <CampaignParticipantsClient campanaId={campanaId} />
    </div>
  );
}

