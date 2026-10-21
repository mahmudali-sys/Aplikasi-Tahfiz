import React from 'react';
import { 
  BookOpen, 
  Plus, 
  Printer, 
  Users, 
  Download, 
  FileSpreadsheet, 
  CalendarDays,
  Sparkles,
  Award
} from 'lucide-react';
import { formatTanggalIndo } from '../data/quranData';

interface HeaderProps {
  onOpenSetoranModal: () => void;
  onOpenSantriModal: () => void;
  onOpenPrintModal: () => void;
  onExportData: () => void;
  activeTab: 'laporan' | 'santri' | 'rekap' | 'sertifikat';
  setActiveTab: (tab: 'laporan' | 'santri' | 'rekap' | 'sertifikat') => void;
  selectedHalaqah: string;
  setSelectedHalaqah: (h: string) => void;
  halaqahList: string[];
}

export const HeaderNavbar: React.FC<HeaderProps> = ({
  onOpenSetoranModal,
  onOpenSantriModal,
  onOpenPrintModal,
  onExportData,
  activeTab,
  setActiveTab,
  selectedHalaqah,
  setSelectedHalaqah,
  halaqahList
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayFormatted = formatTanggalIndo(todayStr);

  return (
    <header className="bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar info */}
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-emerald-800/60">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-inner border border-emerald-400/30 text-white">
              <BookOpen className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Laporan Tahsin &amp; Tahfiz
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-800 text-emerald-200 border border-emerald-700">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-300" /> Mutaba'ah Qur'an
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 flex items-center gap-1.5 mt-0.5">
                <CalendarDays className="w-3.5 h-3.5 text-amber-300" />
                <span>Hari ini: {todayFormatted}</span>
                <span className="text-emerald-400">•</span>
                <span>Pencatatan Setoran, Tajwid, &amp; Kelancaran Santri</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-catat-setoran-baru"
              onClick={onOpenSetoranModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow-sm hover:shadow transition-all duration-150 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Catat Setoran</span>
            </button>

            <button
              id="btn-tambah-santri"
              onClick={onOpenSantriModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-700/80 transition-colors active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Kelola</span> Santri
            </button>

            <button
              id="btn-cetak-laporan"
              onClick={onOpenPrintModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-700/80 transition-colors active:scale-95"
              title="Cetak format rapor atau mutaba'ah santri"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Laporan</span>
            </button>

            <button
              id="btn-ekspor-data"
              onClick={onExportData}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-700/80 transition-colors active:scale-95"
              title="Unduh data laporan dalam format CSV / Excel"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Navigation & Halaqah filter */}
        <div className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
          <nav className="flex items-center gap-1">
            <button
              id="tab-laporan"
              onClick={() => setActiveTab('laporan')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'laporan'
                  ? 'bg-emerald-800 text-amber-300 font-semibold shadow-inner'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              Laporan Setoran Lengkap
            </button>
            <button
              id="tab-santri"
              onClick={() => setActiveTab('santri')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'santri'
                  ? 'bg-emerald-800 text-amber-300 font-semibold shadow-inner'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              Buku Mutaba'ah Santri
            </button>
            <button
              id="tab-rekap"
              onClick={() => setActiveTab('rekap')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'rekap'
                  ? 'bg-emerald-800 text-amber-300 font-semibold shadow-inner'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              Grafik Nilai Santri
            </button>
            <button
              id="tab-sertifikat"
              onClick={() => setActiveTab('sertifikat')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'sertifikat'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-amber-300 hover:text-white hover:bg-emerald-800/60'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Sertifikat Tahfidz (Juz 26-30)</span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <label htmlFor="select-halaqah" className="text-xs text-emerald-300 whitespace-nowrap">
              Filter Halaqah:
            </label>
            <select
              id="select-halaqah"
              value={selectedHalaqah}
              onChange={(e) => setSelectedHalaqah(e.target.value)}
              className="bg-emerald-950/80 text-emerald-100 text-xs sm:text-sm rounded-md px-2.5 py-1 border border-emerald-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="ALL">Semua Halaqah / Kelas</option>
              {halaqahList.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
