import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Award, 
  Target, 
  Sparkles, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Santri, SetoranRecord } from '../types';
import { formatTanggalIndo, calculatePredikat } from '../data/quranData';

interface SantriProgressChartProps {
  santri: Santri;
  records: SetoranRecord[];
  santriList?: Santri[];
  onSelectSantri?: (santri: Santri) => void;
  showSantriSelector?: boolean;
  className?: string;
}

interface ChartDataPoint {
  id: string;
  sessionIndex: number;
  sessionLabel: string;
  tanggal: string;
  hari: string;
  displayDate: string;
  surah: string;
  ayat: string;
  jenis: string;
  nilaiAngka: number;
  predikat: string;
  kelancaran: string;
  salahCount: number;
  status: string;
  pembimbing: string;
}

// Custom Tooltip for Recharts
const CustomChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: ChartDataPoint = payload[0].payload;
    return (
      <div className="bg-white p-3.5 rounded-xl shadow-lg border border-slate-200 text-xs min-w-[220px] max-w-[280px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{data.hari}, {data.displayDate}</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
            {data.sessionLabel}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-slate-500">Nilai Setoran:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                {data.nilaiAngka}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                data.nilaiAngka >= 90 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : data.nilaiAngka >= 80 
                  ? 'bg-teal-100 text-teal-800' 
                  : data.nilaiAngka >= 75 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {data.predikat}
              </span>
            </div>
          </div>

          <div className="text-slate-700 font-semibold pt-1 border-t border-slate-100">
            Surah {data.surah}
            <span className="font-normal text-slate-500 text-[11px] block">
              Ayat {data.ayat} • {data.jenis}
            </span>
          </div>

          <div className="text-[11px] text-slate-600 flex items-center justify-between pt-0.5">
            <span>Kelancaran: <strong>{data.kelancaran}</strong></span>
            <span className="text-slate-400">({data.salahCount}x keliru)</span>
          </div>

          <div className="pt-1 text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
            <span>Status: <strong className={data.status === 'Lulus' ? 'text-emerald-600' : 'text-amber-600'}>{data.status}</strong></span>
            <span>Ustadz: {data.pembimbing.split(',')[0]}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const SantriProgressChart: React.FC<SantriProgressChartProps> = ({
  santri,
  records,
  santriList,
  onSelectSantri,
  showSantriSelector = false,
  className = ''
}) => {
  // Filter for this santri & sort chronologically (oldest to newest)
  const chartData = useMemo(() => {
    const santriRecs = records.filter(r => r.santriId === santri.id);
    
    // Sort ascending by date & time so chronological progress moves left-to-right
    const sorted = [...santriRecs].sort((a, b) => {
      const timeA = new Date(`${a.tanggal}T${a.waktu || '00:00'}`).getTime();
      const timeB = new Date(`${b.tanggal}T${b.waktu || '00:00'}`).getTime();
      if (timeA !== timeB) return timeA - timeB;
      return (a.createdAt || '').localeCompare(b.createdAt || '');
    });

    // Take the last 10 records
    const last10 = sorted.slice(-10);

    return last10.map((rec, index): ChartDataPoint => {
      // Short date e.g. "07/09"
      const parts = rec.tanggal.split('-');
      const shortDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : rec.tanggal;

      return {
        id: rec.id,
        sessionIndex: index + 1,
        sessionLabel: `Setoran #${index + 1}`,
        tanggal: rec.tanggal,
        hari: rec.hari,
        displayDate: formatTanggalIndo(rec.tanggal),
        surah: rec.surah,
        ayat: `${rec.ayatMulai}-${rec.ayatSelesai}`,
        jenis: rec.jenis,
        nilaiAngka: rec.nilaiAngka,
        predikat: rec.predikat,
        kelancaran: rec.kelancaran,
        salahCount: rec.salahTerhentiCount,
        status: rec.status,
        pembimbing: rec.pembimbing
      };
    });
  }, [santri.id, records]);

  // Statistics calculation for the last 10 records
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        count: 0,
        average: 0,
        highest: 0,
        lowest: 0,
        trend: 0,
        trendText: 'Belum ada data',
        predikatAvg: '-'
      };
    }

    const count = chartData.length;
    const values = chartData.map(d => d.nilaiAngka);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = Math.round((sum / count) * 10) / 10;
    const highest = Math.max(...values);
    const lowest = Math.min(...values);

    // Trend: difference between latest score and earliest score in this window
    const firstScore = values[0];
    const latestScore = values[values.length - 1];
    const trend = latestScore - firstScore;

    let trendText = 'Stabil';
    if (trend > 0) {
      trendText = `+${trend} poin`;
    } else if (trend < 0) {
      trendText = `${trend} poin`;
    }

    return {
      count,
      average,
      highest,
      lowest,
      trend,
      trendText,
      predikatAvg: calculatePredikat(average)
    };
  }, [chartData]);

  // Calculate dynamic Y-axis min/max
  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [60, 100];
    const min = Math.min(...chartData.map(d => d.nilaiAngka));
    const floor = Math.max(0, Math.floor((min - 5) / 5) * 5);
    return [Math.min(floor, 70), 100];
  }, [chartData]);

  return (
    <div className={`bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden ${className}`}>
      {/* Chart Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gradient-to-b from-slate-50/70 to-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-800">
              Grafik Perkembangan Nilai Setoran
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Menampilkan tren nilai angka santri <strong className="text-slate-700">{santri.nama}</strong> ({stats.count} dari maksimal 10 setoran terakhir)
          </p>
        </div>

        {/* Right Controls: Santri Selector & Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {showSantriSelector && santriList && onSelectSantri && (
            <div className="flex items-center gap-1.5 mr-1">
              <label htmlFor="select-santri-chart" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                Pilih Santri:
              </label>
              <select
                id="select-santri-chart"
                value={santri.id}
                onChange={(e) => {
                  const target = santriList.find(s => s.id === e.target.value);
                  if (target) onSelectSantri(target);
                }}
                className="bg-white text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {santriList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} ({s.kelas})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quick Stat Badges */}
          {stats.count > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <div className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1.5">
                <span className="text-slate-500 text-[11px]">Rata-rata:</span>
                <span className="font-bold text-slate-900">{stats.average}</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  {stats.predikatAvg}
                </span>
              </div>

              <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                stats.trend > 0
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : stats.trend < 0
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {stats.trend > 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                ) : stats.trend < 0 ? (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span className="font-bold">{stats.trendText}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="p-4 sm:p-5">
        {chartData.length === 0 ? (
          <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              Belum Ada Rekaman Setoran
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Catat setoran Al-Qur'an pertama untuk santri ini agar grafik tren perkembangan nilai angka dapat ditampilkan secara otomatis.
            </p>
          </div>
        ) : chartData.length === 1 ? (
          <div className="py-8 px-4 text-center border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
            <Sparkles className="w-7 h-7 mx-auto text-amber-500" />
            <div>
              <p className="text-sm font-bold text-slate-800">
                1 Setoran Pertama Tercatat
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Nilai setoran pertama: <strong className="text-emerald-700 text-sm">{chartData[0].nilaiAngka}</strong> ({chartData[0].predikat}) pada Surah {chartData[0].surah}.
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Grafik garis tren akan otomatis terbentuk setelah terdapat 2 atau lebih rekaman setoran.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Recharts Container */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  
                  <XAxis
                    dataKey="sessionIndex"
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickFormatter={(value, index) => {
                      const item = chartData[index];
                      return item ? `#${value}` : `#${value}`;
                    }}
                  />
                  
                  <YAxis
                    domain={yDomain}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    ticks={[60, 70, 75, 80, 85, 90, 95, 100].filter(t => t >= yDomain[0] && t <= 100)}
                  />

                  {/* KKM Passing Grade Line (75) */}
                  <ReferenceLine
                    y={75}
                    stroke="#d97706"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: 'Batas KKM (75)',
                      fill: '#b45309',
                      fontSize: 10,
                      position: 'insideBottomRight'
                    }}
                  />

                  <Tooltip content={<CustomChartTooltip />} />

                  {/* Nilai Angka Line */}
                  <Line
                    type="monotone"
                    dataKey="nilaiAngka"
                    name="Nilai Angka"
                    stroke="#047857"
                    strokeWidth={2.5}
                    activeDot={{
                      r: 6,
                      fill: '#047857',
                      stroke: '#ffffff',
                      strokeWidth: 2
                    }}
                    dot={{
                      r: 4,
                      fill: '#065f46',
                      stroke: '#ffffff',
                      strokeWidth: 1.5
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sub-Legend & Metric Indicators */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Sesi Terpantau</span>
                <span className="font-bold text-slate-800 text-sm">
                  {stats.count} Setoran Terakhir
                </span>
              </div>

              <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <span className="text-[11px] text-emerald-700 block">Nilai Tertinggi</span>
                <span className="font-bold text-emerald-900 text-sm">
                  {stats.highest}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                <span className="text-[11px] text-amber-700 block">Nilai Terendah</span>
                <span className="font-bold text-amber-900 text-sm">
                  {stats.lowest}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Status Terkini</span>
                <span className={`font-bold text-xs ${
                  stats.trend > 0 ? 'text-emerald-700' : stats.trend < 0 ? 'text-rose-700' : 'text-slate-700'
                }`}>
                  {stats.trend > 0 ? 'Grafik Meningkat' : stats.trend < 0 ? 'Perlu Ditingkatkan' : 'Performa Stabil'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
