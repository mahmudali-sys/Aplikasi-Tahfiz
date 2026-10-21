import React from 'react';
import { 
  BookOpenCheck, 
  Award, 
  TrendingUp, 
  Users, 
  CalendarCheck,
  CheckCircle2
} from 'lucide-react';
import { SetoranRecord } from '../types';
import { calculatePredikat } from '../data/quranData';

interface StatSummaryProps {
  records: SetoranRecord[];
  totalSantri: number;
}

export const StatSummary: React.FC<StatSummaryProps> = ({ records, totalSantri }) => {
  const totalSetoran = records.length;
  
  const avgNilai = totalSetoran > 0 
    ? Math.round((records.reduce((acc, curr) => acc + curr.nilaiAngka, 0) / totalSetoran) * 10) / 10 
    : 0;
  
  const predikatAvg = calculatePredikat(avgNilai);

  // Kelancaran breakdown
  const lancarCount = records.filter(
    r => r.kelancaran === 'Sangat Lancar' || r.kelancaran === 'Lancar'
  ).length;
  const persenLancar = totalSetoran > 0 ? Math.round((lancarCount / totalSetoran) * 100) : 0;

  // Lulus count
  const lulusCount = records.filter(r => r.status === 'Lulus' || r.status === 'Lanjut').length;
  const persenLulus = totalSetoran > 0 ? Math.round((lulusCount / totalSetoran) * 100) : 0;

  // Hari ini
  const todayStr = new Date().toISOString().split('T')[0];
  const setoranHariIni = records.filter(r => r.tanggal === todayStr).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Total Setoran */}
      <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Total Setoran Al-Qur'an</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-0.5">{totalSetoran}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
            <CalendarCheck className="w-3 h-3" /> {setoranHariIni} setoran hari ini
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
          <BookOpenCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Rata-rata Nilai */}
      <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Rata-rata Nilai</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-800">{avgNilai || '-'}</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              {predikatAvg}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Skala 0 - 100
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
          <Award className="w-5 h-5" />
        </div>
      </div>

      {/* Kelancaran Bacaan */}
      <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Tingkat Kelancaran</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-0.5">{persenLancar}%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {lancarCount} dari {totalSetoran} Sangat/Lancar
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Kelulusan & Santri */}
      <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Tingkat Kelulusan</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold text-emerald-700">{persenLulus}%</span>
            <span className="text-xs text-slate-500">({lulusCount} setoran)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" /> {totalSantri} Santri Terdaftar
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
