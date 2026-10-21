import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  BookOpen, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Download,
  Filter
} from 'lucide-react';
import { Santri, SetoranRecord } from '../types';
import { formatTanggalIndo } from '../data/quranData';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  santriList: Santri[];
  records: SetoranRecord[];
  selectedSantriForPrint?: Santri | null;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  santriList,
  records,
  selectedSantriForPrint
}) => {
  if (!isOpen) return null;

  const [printMode, setPrintMode] = useState<'individual' | 'all'>(
    selectedSantriForPrint ? 'individual' : 'all'
  );
  const [targetSantriId, setTargetSantriId] = useState<string>(
    selectedSantriForPrint?.id || santriList[0]?.id || ''
  );
  const [lembagaNama, setLembagaNama] = useState('SMP ISLAM AL AZHAR / HALAQAH QUR\'AN');
  const [tahunAjaran, setTahunAjaran] = useState('Tahun Ajaran 2026/2027');
  const [namaKoordinator, setNamaKoordinator] = useState('Ustadz Dr. H. Ahmad Fauzi, Lc., M.A.');

  const targetSantri = santriList.find(s => s.id === targetSantriId);

  // Filter records based on printMode
  const printRecords = printMode === 'individual'
    ? records.filter(r => r.santriId === targetSantriId)
    : records;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Modal Controls (Hidden in Print) */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base">Pratinjau Cetak Laporan Tahsin &amp; Tahfiz</h3>
              <p className="text-xs text-emerald-200">Format resmi buku mutaba'ah &amp; rekap setoran Al-Qur'an</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Printer className="w-4 h-4" /> Cetak / Unduh PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Configuration Bar (Hidden in Print) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Jenis Cetak:</span>
            <button
              onClick={() => setPrintMode('all')}
              className={`px-3 py-1 rounded-md font-medium border ${
                printMode === 'all'
                  ? 'bg-emerald-800 text-white border-emerald-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Rekap Semua Setoran
            </button>
            <button
              onClick={() => setPrintMode('individual')}
              className={`px-3 py-1 rounded-md font-medium border ${
                printMode === 'individual'
                  ? 'bg-emerald-800 text-white border-emerald-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Rapor Per Santri
            </button>
          </div>

          {printMode === 'individual' && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Pilih Santri:</span>
              <select
                value={targetSantriId}
                onChange={(e) => setTargetSantriId(e.target.value)}
                className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs font-semibold"
              >
                {santriList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} ({s.kelas})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-8 overflow-y-auto print:overflow-visible print:p-0 bg-white text-slate-900 font-sans text-xs">
          {/* KOP Surat Resmi */}
          <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
            <h1 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
              {lembagaNama}
            </h1>
            <h2 className="text-sm font-bold text-emerald-900 uppercase tracking-normal mt-0.5">
              LEMBAR LAPORAN CAPAIAN MUTABA'AH TAHSIN &amp; TAHFIZ AL-QUR'AN
            </h2>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {tahunAjaran} • Dievaluasi Berdasarkan Kaidah Tajwid &amp; Tingkat Kelancaran Bacaan
            </p>
          </div>

          {/* Identitas Santri / Laporan */}
          {printMode === 'individual' && targetSantri ? (
            <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-50 print:bg-transparent p-3 rounded-lg border border-slate-200 print:border-none print:p-0 text-xs">
              <div>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-28 py-0.5 font-semibold text-slate-600">Nama Santri</td>
                      <td className="py-0.5 font-bold text-slate-900">: {targetSantri.nama}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-semibold text-slate-600">NIS / Kelas</td>
                      <td className="py-0.5 font-semibold text-slate-900">: {targetSantri.nis} / Kelas {targetSantri.kelas}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-28 py-0.5 font-semibold text-slate-600">Halaqah</td>
                      <td className="py-0.5 font-semibold text-slate-900">: {targetSantri.halaqah}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-semibold text-slate-600">Pembimbing</td>
                      <td className="py-0.5 font-semibold text-slate-900">: {targetSantri.pembimbing}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center mb-3 text-xs font-semibold text-slate-700">
              <span>Rekapitulasi Penilaian Setoran Al-Qur'an Santri</span>
              <span>Tanggal Cetak: {formatTanggalIndo(todayStr)}</span>
            </div>
          )}

          {/* Table Data */}
          <table className="w-full text-left border-collapse border border-slate-400 text-[11px]">
            <thead>
              <tr className="bg-slate-200 text-slate-800 font-bold border border-slate-400">
                <th className="border border-slate-400 p-1.5 text-center w-8">No</th>
                <th className="border border-slate-400 p-1.5 w-24">Hari &amp; Tanggal</th>
                {printMode === 'all' && (
                  <th className="border border-slate-400 p-1.5 w-28">Nama Santri</th>
                )}
                <th className="border border-slate-400 p-1.5 w-20">Jenis</th>
                <th className="border border-slate-400 p-1.5">Surah &amp; Ayat</th>
                <th className="border border-slate-400 p-1.5">Kelancaran Bacaan</th>
                <th className="border border-slate-400 p-1.5">Catatan Tajwid</th>
                <th className="border border-slate-400 p-1.5 text-center w-14">Nilai</th>
                <th className="border border-slate-400 p-1.5 text-center w-16">Predikat</th>
                <th className="border border-slate-400 p-1.5 text-center w-14">Status</th>
                <th className="border border-slate-400 p-1.5 text-center w-20">Paraf</th>
              </tr>
            </thead>
            <tbody>
              {printRecords.map((r, i) => (
                <tr key={r.id} className="border border-slate-300">
                  <td className="border border-slate-300 p-1.5 text-center">{i + 1}</td>
                  <td className="border border-slate-300 p-1.5 whitespace-nowrap">
                    <strong>{r.hari}</strong>,<br />{formatTanggalIndo(r.tanggal)}
                  </td>
                  {printMode === 'all' && (
                    <td className="border border-slate-300 p-1.5 font-bold">
                      {r.santriNama}<br />
                      <span className="font-normal text-[10px] text-slate-600">({r.santriKelas})</span>
                    </td>
                  )}
                  <td className="border border-slate-300 p-1.5">{r.jenis}</td>
                  <td className="border border-slate-300 p-1.5">
                    <strong>{r.surah}</strong><br />
                    Ayat {r.ayatMulai} - {r.ayatSelesai} (Juz {r.juz})
                  </td>
                  <td className="border border-slate-300 p-1.5">
                    <strong>{r.kelancaran}</strong><br />
                    {r.salahTerhentiCount > 0 ? `${r.salahTerhentiCount}x salah` : 'Mutqin'}<br />
                    <span className="italic text-[10px] text-slate-600">{r.catatanKelancaran}</span>
                  </td>
                  <td className="border border-slate-300 p-1.5">
                    <span className="text-[10px]">{r.catatanTajwid || 'Tajwid baik & sesuai kaidah'}</span>
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold text-sm">
                    {r.nilaiAngka}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center font-semibold">
                    {r.predikat}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center">
                    {r.status}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center">
                    <div className="h-6"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Rangkuman Nilai & Tanda Tangan */}
          <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <p className="font-medium text-slate-600">Mengetahui,</p>
              <p className="font-bold text-slate-800">Orang Tua / Wali Santri</p>
              <div className="h-16"></div>
              <p className="border-b border-slate-400 w-36 mx-auto"></p>
            </div>

            <div>
              <p className="font-medium text-slate-600">Koordinator Tahsin Tahfiz</p>
              <p className="font-bold text-slate-800">Penanggung Jawab Program</p>
              <div className="h-16"></div>
              <p className="font-bold text-slate-900 underline">{namaKoordinator}</p>
            </div>

            <div>
              <p className="font-medium text-slate-600">Jakarta, {formatTanggalIndo(todayStr)}</p>
              <p className="font-bold text-slate-800">Ustadz / Ustadzah Pembimbing</p>
              <div className="h-16"></div>
              <p className="font-bold text-slate-900 underline">
                {targetSantri?.pembimbing || 'Ustadz Pembimbing'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
