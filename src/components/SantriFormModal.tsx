import React, { useState } from 'react';
import { X, UserPlus, Save } from 'lucide-react';
import { Santri } from '../types';

interface SantriFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (santri: Santri) => void;
  initialData?: Santri | null;
}

export const SantriFormModal: React.FC<SantriFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  if (!isOpen) return null;

  const [nis, setNis] = useState(initialData?.nis || '');
  const [nama, setNama] = useState(initialData?.nama || '');
  const [kelas, setKelas] = useState(initialData?.kelas || '7A');
  const [halaqah, setHalaqah] = useState(initialData?.halaqah || 'Halaqah Abu Bakar Ash-Shiddiq');
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>(initialData?.jenisKelamin || 'L');
  const [pembimbing, setPembimbing] = useState(initialData?.pembimbing || 'Ustadz Abdullah, S.Pd.I');
  const [targetJuz, setTargetJuz] = useState<number>(initialData?.targetJuz || 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    const data: Santri = {
      id: initialData?.id || `s-${Date.now()}`,
      nis: nis.trim() || `2026${Math.floor(1000 + Math.random() * 9000)}`,
      nama: nama.trim(),
      kelas: kelas.trim(),
      halaqah: halaqah.trim(),
      jenisKelamin,
      pembimbing: pembimbing.trim(),
      targetJuz: Number(targetJuz) || 3
    };

    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">
              {initialData ? 'Edit Data Santri' : 'Tambah Santri Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm text-slate-800">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Lengkap Santri <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Muhammad Al-Fatih"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIS / No. Induk
              </label>
              <input
                type="text"
                placeholder="20260107"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenis Kelamin
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setJenisKelamin('L')}
                  className={`flex-1 py-2 rounded-lg border text-xs font-semibold ${
                    jenisKelamin === 'L'
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Ikhwan (L)
                </button>
                <button
                  type="button"
                  onClick={() => setJenisKelamin('P')}
                  className={`flex-1 py-2 rounded-lg border text-xs font-semibold ${
                    jenisKelamin === 'P'
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Akhwat (P)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kelas
              </label>
              <input
                type="text"
                placeholder="e.g. 7A / 8B / 9A"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Hafalan (Juz)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={targetJuz}
                onChange={(e) => setTargetJuz(parseInt(e.target.value) || 3)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Halaqah
            </label>
            <input
              type="text"
              placeholder="e.g. Halaqah Abu Bakar Ash-Shiddiq"
              value={halaqah}
              onChange={(e) => setHalaqah(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Ustadz / Ustadzah Pembimbing
            </label>
            <input
              type="text"
              placeholder="e.g. Ustadz Abdullah, S.Pd.I"
              value={pembimbing}
              onChange={(e) => setPembimbing(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Simpan Santri
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
