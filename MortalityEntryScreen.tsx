
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Flock, Shed } from '../types';

interface MortalityEntryScreenProps {
  farmId: string;
  onBack: () => void;
  onSuccess: () => void;
}

const CAUSES = [
  { value: 'disease', label: 'Disease (बीमारी)' },
  { value: 'management', label: 'Management (प्रबंधन)' },
  { value: 'predator', label: 'Predator (परभक्षी)' },
  { value: 'unknown', label: 'Unknown (अज्ञात)' },
  { value: 'other', label: 'Other (अन्य)' },
];

export const MortalityEntryScreen: React.FC<MortalityEntryScreenProps> = ({ farmId, onBack, onSuccess }) => {
  const [flocks, setFlocks] = useState<Flock[]>([]);
  const [sheds, setSheds] = useState<Shed[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const [formData, setFormData] = useState({
    flock_id: '',
    shed_id: '',
    mortality_date: new Date().toISOString().split('T')[0],
    dead_count: '',
    cause: 'unknown',
    remarks: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [flocksRes, shedsRes] = await Promise.all([
          supabase.from('flocks').select('id, name').eq('farm_id', farmId),
          supabase.from('sheds').select('id, name').eq('farm_id', farmId)
        ]);

        if (flocksRes.error) throw flocksRes.error;
        if (shedsRes.error) throw shedsRes.error;

        setFlocks(flocksRes.data || []);
        setSheds(shedsRes.data || []);
        
        if (flocksRes.data && flocksRes.data.length > 0) {
          setFormData(prev => ({ ...prev, flock_id: flocksRes.data[0].id }));
        }
      } catch (err: any) {
        setMessage({ type: 'error', text: 'डाटा लोड करने में विफल (Failed to load data)' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [farmId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.flock_id || !formData.dead_count) {
      setMessage({ type: 'error', text: 'कृपया सभी आवश्यक फ़ील्ड भरें (Please fill required fields)' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('mortality')
        .insert([{
          farm_id: farmId,
          flock_id: formData.flock_id,
          shed_id: formData.shed_id || null,
          mortality_date: formData.mortality_date,
          count: parseInt(formData.dead_count),
          cause: formData.cause,
          remarks: formData.remarks
        }]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'मृत्यु दर एंट्री सफल! (Entry Successful!)' });
      setTimeout(() => onSuccess(), 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'सबमिट करने में विफल (Submission failed)' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="text-slate-400 text-xl hover:text-slate-600 transition-colors">←</button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Mortality Entry</h1>
            <p className="text-xs text-red-500 uppercase font-bold tracking-wider">मृत्यु दर विवरण</p>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Select Flock / झुंड चुनें *</label>
              <select
                value={formData.flock_id}
                onChange={(e) => setFormData({ ...formData, flock_id: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none appearance-none text-slate-900 font-medium"
                required
              >
                <option value="" className="text-slate-500">Choose a flock...</option>
                {flocks.map(f => <option key={f.id} value={f.id} className="text-slate-900">{f.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Select Shed / शेड चुनें (वैकल्पिक)</label>
              <select
                value={formData.shed_id}
                onChange={(e) => setFormData({ ...formData, shed_id: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none appearance-none text-slate-900 font-medium"
              >
                <option value="" className="text-slate-500">All Sheds / कोई विशिष्ट नहीं</option>
                {sheds.map(s => <option key={s.id} value={s.id} className="text-slate-900">{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Dead Count / मृत पक्षियों की संख्या *</label>
              <input
                type="number"
                min="0"
                value={formData.dead_count}
                onChange={(e) => setFormData({ ...formData, dead_count: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-slate-900 font-medium"
                placeholder="e.g. 5"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Date / तिथि *</label>
              <input
                type="date"
                value={formData.mortality_date}
                onChange={(e) => setFormData({ ...formData, mortality_date: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-slate-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Cause / कारण *</label>
              <div className="grid grid-cols-2 gap-2">
                {CAUSES.map(cause => (
                  <button
                    key={cause.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, cause: cause.value })}
                    className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${formData.cause === cause.value ? 'bg-red-500 text-white border-red-500 shadow-md' : 'bg-white text-slate-600 border-slate-100'}`}
                  >
                    {cause.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Remarks / टिप्पणी (वैकल्पिक)</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none min-h-[100px] text-slate-900 font-medium"
                placeholder="Additional notes about the cause or flock health..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg hover:bg-red-600 transition-all transform active:scale-[0.98] ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Saving...' : 'Save Entry / सुरक्षित करें'}
          </button>
        </form>
      </div>
    </div>
  );
};
