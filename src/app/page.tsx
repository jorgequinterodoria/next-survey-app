'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SurveyRunner from '@/components/SurveyRunner';
import { AlertCircle } from 'lucide-react';

function HomeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<{ id: string; name: string; empresa: string } | null>(null);

  useEffect(() => {
    if (!token) {
        setLoading(false); // No token, show instruction or simplified error? Plan implies public link is entry.
        return;
    }

    async function validate() {
      try {
        const res = await fetch(`/api/survey/validate?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setCampaign(data.campaign);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    }

    validate();
  }, [token]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-pulse text-blue-600">Cargando encuesta...</div>
        </div>
    )
  }

  if (!token) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
              <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h1 className="text-xl font-bold text-gray-800 mb-2">Enlace requerido</h1>
                  <p className="text-gray-600">Por favor acceda a la encuesta utilizando el enlace proporcionado por su empresa.</p>
              </div>
          </div>
      )
  }

  if (error || !campaign) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-gray-800 mb-2">Error de acceso</h1>
                <p className="text-gray-600">{error || 'Campaña no encontrada'}</p>
            </div>
        </div>
    )
  }

  return (
    <SurveyRunner 
        campaignId={campaign.id} 
        campaignName={campaign.name} 
        companyName={campaign.empresa} 
    />
  );
}

export default function Home() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
            <HomeContent />
        </Suspense>
    )
}
