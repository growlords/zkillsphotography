import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, ListOrdered, ArrowUp, ArrowDown } from 'lucide-react';
import { useAdminToast } from '../components/AdminToast';

interface ProcessStep {
  step: string;
  title: string;
  description: string;
  displayOrder: number;
}

export const ProcessEditor: React.FC = () => {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useAdminToast();

  const loadSteps = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/process');
      if (res.ok) {
        const data = await res.json();
        setSteps(Array.isArray(data) ? data : []);
      }
    } catch {
      toast('Failed to load process steps', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSteps();
  }, []);

  const handleChange = (idx: number, field: keyof ProcessStep, val: any) => {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], [field]: val };
    setSteps(updated);
  };

  const handleAddStep = () => {
    const nextNum = (steps.length + 1).toString().padStart(2, '0');
    setSteps([
      ...steps,
      {
        step: nextNum,
        title: 'New Workflow Phase',
        description: 'Detailing the preparation and cinematic process.',
        displayOrder: steps.length + 1,
      },
    ]);
  };

  const handleRemoveStep = (idx: number) => {
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const handleMove = (idx: number, dir: 'up' | 'down') => {
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === steps.length - 1)) return;
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    const updated = [...steps];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSteps(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/content/process', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(steps),
      });

      if (res.ok) {
        toast('Process steps saved and published', 'success');
      } else {
        toast('Failed to save steps', 'error');
      }
    } catch {
      toast('Error saving process steps', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 text-champagne animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-champagne block mb-1">
            Production Workflow
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Process Steps Editor
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Configure the 4-5 core steps that guide couples from consultation through film delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddStep}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-champagne" />
            <span>Add Step</span>
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-champagne/20 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-[#121217] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-champagne/30 transition-colors"
          >
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1 rounded bg-white/5 text-white/40 hover:text-white disabled:opacity-20"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  disabled={idx === steps.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1 rounded bg-white/5 text-white/40 hover:text-white disabled:opacity-20"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>

              <div className="w-14">
                <label className="block text-[10px] font-mono text-white/40 uppercase">Step</label>
                <input
                  type="text"
                  value={step.step}
                  onChange={(e) => handleChange(idx, 'step', e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-[#09090C] border border-white/15 text-champagne font-mono font-bold text-center text-sm"
                />
              </div>
            </div>

            <div className="flex-1 w-full space-y-2">
              <div>
                <label className="block text-[10px] font-mono text-white/40 uppercase">
                  Phase Title
                </label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => handleChange(idx, 'title', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-white/40 uppercase">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={step.description}
                  onChange={(e) => handleChange(idx, 'description', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#09090C] border border-white/15 text-white text-xs focus:border-champagne"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveStep(idx)}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 self-end sm:self-center transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </form>
  );
};
