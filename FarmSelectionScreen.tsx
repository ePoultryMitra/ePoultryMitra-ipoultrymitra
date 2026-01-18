
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Farm } from '../types';

interface FarmSelectionScreenProps {
  onSelect: (farmId: string) => void;
}

export const FarmSelectionScreen: React.FC<FarmSelectionScreenProps> = ({ onSelect }) => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found");

        // Correct query: Selecting only id and farm_name from the farms table
        const { data, error: fetchError } = await supabase
          .from('user_farms')
          .select(`
            farm_id,
            farms (
              id,
              farm_name
            )
          `);

        if (fetchError) throw fetchError;

        if (data) {
          const farmList: Farm[] = data
            .filter((item: any) => item.farms)
            .map((item: any) => ({
              id: item.farms.id,
              farm_name: item.farms.farm_name
            }));
          setFarms(farmList);
        }
      } catch (err: any) {
        console.error("Error fetching farms:", err);
        setError(err.message || "Failed to load farms");
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col">
      <div className="mb-8 text-center pt-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Select Farm</h1>
        <p className="text-slate-500 mt-2">अपना फार्म चुनें</p>
      </div>

      <div className="flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-medium">Loading farms...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
            <p className="font-bold">Error</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
            >
              Retry / पुनः प्रयास करें
            </button>
          </div>
        ) : farms.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-slate-200">
            <div className="text-4xl mb-4">🏚️</div>
            <p className="text-slate-600 font-medium">No farms found.</p>
            <p className="text-slate-400 text-sm mt-1">Please contact admin to register your farm.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {farms.map((farm) => (
              <button
                key={farm.id}
                onClick={() => onSelect(farm.id)}
                className="w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-orange-500 hover:shadow-md transition-all transform active:scale-[0.98] group text-left"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                    {farm.farm_name}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center font-bold">
                  →
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="w-full py-4 text-slate-400 font-medium hover:text-red-500 transition-colors"
        >
          Sign Out / लॉग आउट
        </button>
      </div>
    </div>
  );
};
