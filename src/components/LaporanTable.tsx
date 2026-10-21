import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Eye, 
  Edit3, 
  Trash2, 
  BookOpen, 
  ArrowUpDown,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { SetoranRecord, JenisSetoran, TingkatKelancaran, StatusSetoran } from '../types';
import { formatTanggalIndo } from '../data/quranData';

interface LaporanTableProps {
  records: SetoranRecord[];
  onViewDetail: (record: SetoranRecord) => void;
  onEdit: (record: SetoranRecord) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  selectedHalaqah: string;
}

export const LaporanTable: React.FC<LaporanTableProps> = ({
  records,
  onViewDetail,
  onEdit,
  onDelete,
  onAddNew,
  selectedHalaqah
}) => {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState<string>('ALL');
  const [filterKelancaran, setFilterKelancaran] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterHari, setFilterHari] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'score-desc' | 'score-asc'>('date-desc');

  // Filtered & Sorted records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Halaqah filter
      if (selectedHalaqah !== 'ALL') {
        // match via santri class or halaqah
        if (!rec.santriKelas.toLowerCase().includes(selectedHalaqah.toLowerCase())) {
          // If we need halaqah, we check outside or halaqah match
        }
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchSearch = 
          rec.santriNama.toLowerCase().includes(query) ||
          rec.surah.toLowerCase().includes(query) ||
          rec.santriKelas.toLowerCase().includes(query) ||
          rec.pembimbing.toLowerCase().includes(query) ||
          rec.catatanTajwid.toLowerCase().includes(query) ||
          rec.catatanKelancaran.toLowerCase().includes(query);
        if (!matchSearch) return false;
      }

      // Jenis filter
      if (filterJenis !== 'ALL' && rec.jenis !== filterJenis) {
        return false;
      }

      // Kelancaran filter
      if (filterKelancaran !== 'ALL' && rec.kelancaran !== filterKelancaran) {
        return false;
      }

      // Status filter
      if (filterStatus !== 'ALL' && rec.status !== filterStatus) {
        return false;
      }

      // Hari filter
      if (filterHari !== 'ALL' && rec.hari !== filterHari) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
      }
      if (sortBy === 'score-desc') {
        return b.nilaiAngka - a.nilaiAngka;
      }
      if (sortBy === 'score-asc') {
        return a.nilaiAngka - b.nilaiAngka;
      }
      return 0;
    });
  }, [records, selectedHalaqah, searchTerm, filterJenis, filterKelancaran, filterStatus, filterHari, sortBy]);

  // Helper styles for badges
  const getKelancaranBadge = (kelancaran: TingkatKelancaran) => {
    switch (kelancaran) {
      case 'Sangat Lancar':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';
      case 'Lancar':
        return 'bg-teal-50 text-teal-800 border-teal-200 font-medium';
      case 'Cukup Lancar':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-medium';
      case 'Kurang Lancar':
        return 'bg-rose-50 text-rose-800 border-rose-200 font-medium';
    }
  };

  const getStatusBadge = (status: StatusSetoran) => {
    switch (status) {
      case 'Lulus':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Lanjut':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case "Ulang (I'adah)":
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
    }
  };

  const getPredikatColor = (predikat: string) => {
    switch (predikat) {
      case 'Mumtaz':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Jayyid Jiddan':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      case 'Jayyid':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Maqbul':
        return 'text-slate-700 bg-slate-100 border-slate-200';
      default:
        return 'text-rose-700 bg-rose-50 border-rose-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="input-search-laporan"
              placeholder="Cari santri, surah, catatan tajwid, atau pembimbing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Quick Sort & Clear */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Urutan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="date-desc">Tanggal Terbaru</option>
                <option value="date-asc">Tanggal Terlama</option>
                <option value="score-desc">Nilai Tertinggi</option>
                <option value="score-asc">Nilai Terendah</option>
              </select>
            </div>

            {(searchTerm || filterJenis !== 'ALL' || filterKelancaran !== 'ALL' || filterStatus !== 'ALL' || filterHari !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterJenis('ALL');
                  setFilterKelancaran('ALL');
                  setFilterStatus('ALL');
                  setFilterHari('ALL');
                }}
                className="text-xs text-rose-600 hover:text-rose-700 px-2 py-1.5 rounded bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Filter Hari */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Hari Setoran:</label>
            <select
              value={filterHari}
              onChange={(e) => setFilterHari(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-700"
            >
              <option value="ALL">Semua Hari</option>
              <option value="Senin">Senin</option>
              <option value="Selasa">Selasa</option>
              <option value="Rabu">Rabu</option>
              <option value="Kamis">Kamis</option>
              <option value="Jumat">Jumat</option>
              <option value="Sabtu">Sabtu</option>
              <option value="Minggu">Minggu</option>
            </select>
          </div>

          {/* Filter Jenis */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Jenis Setoran / Ujian:</label>
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-700"
            >
              <option value="ALL">Semua Jenis</option>
              <option value="Tahsin">Tahsin</option>
              <option value="Tahfiz Ziyadah">Tahfiz Ziyadah (Baru)</option>
              <option value="Tahfiz Muroja'ah">Tahfiz Muroja'ah</option>
              <option value="Rasmi’ / Tasmi’ Al-Qur'an">Rasmi’ / Tasmi’ Al-Qur'an</option>
            </select>
          </div>

          {/* Filter Kelancaran */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Kelancaran Bacaan:</label>
            <select
              value={filterKelancaran}
              onChange={(e) => setFilterKelancaran(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-700"
            >
              <option value="ALL">Semua Tingkat</option>
              <option value="Sangat Lancar">Sangat Lancar</option>
              <option value="Lancar">Lancar</option>
              <option value="Cukup Lancar">Cukup Lancar</option>
              <option value="Kurang Lancar">Kurang Lancar</option>
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status Kelulusan:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-700"
            >
              <option value="ALL">Semua Status</option>
              <option value="Lulus">Lulus</option>
              <option value="Lanjut">Lanjut</option>
              <option value="Ulang (I'adah)">Ulang (I'adah)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800">
              Daftar Laporan Setoran Al-Qur'an
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {filteredRecords.length} Data
            </span>
          </div>

          <p className="text-xs text-slate-500 hidden sm:block">
            Menampilkan catatan hari, tanggal, ayat, tajwid, dan kelancaran
          </p>
        </div>

        {/* Table Content */}
        {filteredRecords.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">Tidak ada data setoran yang cocok</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Sesuaikan kata kunci pencarian atau filter di atas, atau tambahkan catatan setoran baru untuk santri.
            </p>
            <button
              onClick={onAddNew}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-600 transition-colors"
            >
              + Catat Setoran Baru
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-3 w-10 text-center">No</th>
                  <th className="py-3 px-3.5">Hari &amp; Tanggal</th>
                  <th className="py-3 px-3.5">Santri</th>
                  <th className="py-3 px-3">Jenis</th>
                  <th className="py-3 px-3.5">Surah &amp; Ayat</th>
                  <th className="py-3 px-3.5">Kelancaran Bacaan</th>
                  <th className="py-3 px-3.5">Evaluasi Tajwid</th>
                  <th className="py-3 px-3 text-center">Kolom Nilai</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {filteredRecords.map((record, index) => {
                  const passedTajwidCount = Object.values(record.aspekTajwid).filter(Boolean).length;
                  return (
                    <tr 
                      key={record.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* No */}
                      <td className="py-3 px-3 text-center font-medium text-slate-400 text-xs">
                        {index + 1}
                      </td>

                      {/* Hari & Tanggal Setoran */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {record.hari}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium mt-1">
                          {formatTanggalIndo(record.tanggal)}
                        </div>
                        {record.waktu && (
                          <div className="text-[10px] text-slate-400">
                            Pukul {record.waktu}
                          </div>
                        )}
                      </td>

                      {/* Santri & Kelas */}
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {record.santriNama}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Kelas {record.santriKelas}
                        </div>
                      </td>

                      {/* Jenis Setoran */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md border ${
                          record.jenis === 'Rasmi’ / Tasmi’ Al-Qur\'an'
                            ? 'bg-amber-100 text-emerald-950 border-amber-300 font-bold'
                            : record.jenis === 'Tahsin'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : record.jenis === 'Tahfiz Ziyadah'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-purple-50 text-purple-800 border-purple-200'
                        }`}>
                          {record.jenis}
                        </span>
                      </td>

                      {/* Surah & Ayat */}
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-emerald-950 flex items-center gap-1 text-xs sm:text-sm">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{record.surah}</span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium mt-0.5">
                          Ayat {record.ayatMulai} - {record.ayatSelesai}
                          <span className="text-[10px] text-slate-400 ml-1.5">(Juz {record.juz})</span>
                        </div>
                      </td>

                      {/* Fitur Kelancaran Bacaan */}
                      <td className="py-3 px-3.5 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${getKelancaranBadge(record.kelancaran)}`}>
                            {record.kelancaran}
                          </span>
                          {record.salahTerhentiCount > 0 ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold" title="Jumlah tawaqquf/salah">
                              {record.salahTerhentiCount}x salah
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                              Mutqin
                            </span>
                          )}
                        </div>
                        {record.catatanKelancaran ? (
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-1 italic">
                            "{record.catatanKelancaran}"
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Tanpa catatan khusus
                          </p>
                        )}
                      </td>

                      {/* Fitur Penilaian Tajwid & Rasmi' Santri */}
                      <td className="py-3 px-3.5 max-w-xs">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                            {passedTajwidCount}/6 Aspek
                          </span>
                          {(record.kesalahanMakhraj !== undefined || record.kesalahanMad !== undefined || record.kesalahanTajwidCount !== undefined) && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200" title="Rincian kesalahan Rasmi' (Makhraj, Mad, Tajwid)">
                              M:{record.kesalahanMakhraj || 0} | Md:{record.kesalahanMad || 0} | Tj:{record.kesalahanTajwidCount || 0}
                            </span>
                          )}
                        </div>
                        {record.catatanTajwid ? (
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-1 font-sans">
                            {record.catatanTajwid}
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Tajwid baik &amp; sesuai kaidah
                          </p>
                        )}
                      </td>

                      {/* Kolom Nilai */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="text-base font-extrabold text-slate-800">
                          {record.nilaiAngka}
                        </div>
                        <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded border ${getPredikatColor(record.predikat)}`}>
                          {record.predikat}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(record.status)}`}>
                          {record.status}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onViewDetail(record)}
                            title="Lihat Detail Setoran"
                            className="p-1.5 rounded-md text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(record)}
                            title="Edit Setoran"
                            className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(record.id)}
                            title="Hapus Data"
                            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer info */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Menampilkan <strong>{filteredRecords.length}</strong> dari <strong>{records.length}</strong> total rekaman setoran
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Skala Predikat: Mumtaz (90-100), Jayyid Jiddan (80-89), Jayyid (70-79), Maqbul (60-69), I'adah (&lt;60)
          </span>
        </div>
      </div>
    </div>
  );
};
