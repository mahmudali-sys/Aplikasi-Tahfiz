import React, { useState } from 'react';
import { 
  User, 
  BookOpen, 
  Award, 
  Calendar, 
  Plus, 
  Printer, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  TrendingUp,
  Edit2,
  Trash2
} from 'lucide-react';
import { Santri, SetoranRecord, SertifikatTahfidz, CapaianJuz } from '../types';
import { formatTanggalIndo, calculatePredikat } from '../data/quranData';
import { SantriProgressChart } from './SantriProgressChart';

interface SantriCardsProps {
  santriList: Santri[];
  records: SetoranRecord[];
  certificates?: SertifikatTahfidz[];
  onOpenNewSetoranForSantri: (santri: Santri) => void;
  onEditSantri: (santri: Santri) => void;
  onDeleteSantri: (id: string) => void;
  onPrintSantriReport: (santri: Santri) => void;
  onViewRecordDetail: (record: SetoranRecord) => void;
  onOpenCreateCertificate?: (santriId?: string, juz?: CapaianJuz) => void;
  onViewCertificate?: (cert: SertifikatTahfidz) => void;
}

export const SantriCards: React.FC<SantriCardsProps> = ({
  santriList,
  records,
  certificates = [],
  onOpenNewSetoranForSantri,
  onEditSantri,
  onDeleteSantri,
  onPrintSantriReport,
  onViewRecordDetail,
  onOpenCreateCertificate,
  onViewCertificate
}) => {
  const [selectedSantriId, setSelectedSantriId] = useState<string | null>(santriList[0]?.id || null);

  const selectedSantri = santriList.find(s => s.id === selectedSantriId);
  const santriRecords = records.filter(r => r.santriId === selectedSantriId);

  // Santri stats
  const totalSetoran = santriRecords.length;
  const avgNilai = totalSetoran > 0 
    ? Math.round((santriRecords.reduce((acc, c) => acc + c.nilaiAngka, 0) / totalSetoran) * 10) / 10
    : 0;
  const predikat = calculatePredikat(avgNilai);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Column: Santri Roster List */}
      <div className="lg:col-span-4 space-y-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Daftar Santri Halaqah</h3>
            <p className="text-xs text-slate-500">{santriList.length} Santri Terdaftar</p>
          </div>
        </div>

        <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {santriList.map((santri) => {
            const isSelected = santri.id === selectedSantriId;
            const santriCount = records.filter(r => r.santriId === santri.id).length;
            const lastSetoran = records.filter(r => r.santriId === santri.id)[0]; // already ordered or latest

            return (
              <div
                key={santri.id}
                onClick={() => setSelectedSantriId(santri.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-950 shadow-md ring-2 ring-emerald-600/40'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-amber-400 text-emerald-950 font-extrabold'
                        : santri.jenisKelamin === 'L'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {santri.nama.charAt(0)}
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {santri.nama}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                        {santri.kelas} • NIS: {santri.nis}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-emerald-800 text-amber-300 border border-emerald-700'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {santriCount} Setoran
                  </span>
                </div>

                {lastSetoran && (
                  <div className={`mt-2.5 pt-2 border-t text-[11px] flex items-center justify-between ${
                    isSelected ? 'border-emerald-800/80 text-emerald-200' : 'border-slate-100 text-slate-500'
                  }`}>
                    <span>Terakhir: Surah {lastSetoran.surah}</span>
                    <span className="font-semibold">{formatTanggalIndo(lastSetoran.tanggal)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Detail Buku Mutaba'ah Santri Terpilih */}
      <div className="lg:col-span-8">
        {selectedSantri ? (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden space-y-5">
            {/* Header Profil Santri */}
            <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-extrabold text-xl shadow-md border-2 border-amber-300/40">
                    {selectedSantri.nama.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-bold">{selectedSantri.nama}</h2>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-800 text-amber-200 border border-emerald-700">
                        {selectedSantri.kelas}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200 mt-0.5">
                      NIS: {selectedSantri.nis} • {selectedSantri.halaqah}
                    </p>
                    <p className="text-xs text-emerald-300/90 mt-0.5">
                      Pembimbing: {selectedSantri.pembimbing}
                    </p>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenNewSetoranForSantri(selectedSantri)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-emerald-950 hover:bg-amber-300 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> + Setoran
                  </button>

                  <button
                    onClick={() => onPrintSantriReport(selectedSantri)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-700 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" /> Cetak Rapor
                  </button>

                  <button
                    onClick={() => onEditSantri(selectedSantri)}
                    className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors"
                    title="Edit Profil Santri"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteSantri(selectedSantri.id)}
                    className="p-1.5 rounded-lg bg-emerald-800 hover:bg-rose-700 text-emerald-200 hover:text-white transition-colors"
                    title="Hapus Santri"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Santri Metric Strip */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-800/80 text-center">
                <div className="bg-emerald-950/50 p-2 rounded-lg border border-emerald-800/60">
                  <p className="text-[10px] text-emerald-300 font-medium">Total Setoran</p>
                  <p className="text-base font-bold text-white">{totalSetoran}</p>
                </div>
                <div className="bg-emerald-950/50 p-2 rounded-lg border border-emerald-800/60">
                  <p className="text-[10px] text-emerald-300 font-medium">Rata-rata Nilai</p>
                  <p className="text-base font-bold text-amber-300">{avgNilai || '-'} ({predikat})</p>
                </div>
                <div className="bg-emerald-950/50 p-2 rounded-lg border border-emerald-800/60">
                  <p className="text-[10px] text-emerald-300 font-medium">Target Capaian</p>
                  <p className="text-base font-bold text-emerald-100">{selectedSantri.targetJuz || 3} Juz</p>
                </div>
              </div>

              {/* Capaian Khatam Juz & Syahadah Tahfidz Strip */}
              <div className="mt-3.5 pt-3 border-t border-emerald-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Status Kelulusan Ujian Rasmi’ (Juz 26-30):</span>
                  </div>
                  {onOpenCreateCertificate && (
                    <button
                      onClick={() => onOpenCreateCertificate(selectedSantri.id, 30)}
                      className="text-[11px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-2.5 py-1 rounded-md transition-colors inline-flex items-center gap-1 w-fit"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" /> Terbitkan Syahadah
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mt-2">
                  {([30, 29, 28, 27, 26] as CapaianJuz[]).map((jNum) => {
                    const isCompleted = (selectedSantri.juzLulus || []).includes(jNum);
                    const cert = certificates.find(c => c.santriId === selectedSantri.id && c.juzUtama === jNum);

                    return (
                      <div
                        key={jNum}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-950 border-amber-400/80 text-white'
                            : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300/60'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-extrabold text-xs">Juz {jNum}</span>
                          {isCompleted && <CheckCircle2 className="w-3 h-3 text-amber-300" />}
                        </div>
                        {cert && onViewCertificate ? (
                          <button
                            onClick={() => onViewCertificate(cert)}
                            className="text-[10px] text-amber-300 hover:text-white font-semibold underline block mt-0.5 mx-auto cursor-pointer"
                          >
                            Lihat Syahadah
                          </button>
                        ) : isCompleted ? (
                          <span className="text-[10px] text-emerald-300 block mt-0.5 font-medium">Lulus</span>
                        ) : (
                          <span className="text-[10px] text-emerald-400/60 block mt-0.5">Belum</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Visual Recharts Line Chart for Santri's Progress over Last 10 Records */}
            <div className="px-5 pt-2">
              <SantriProgressChart santri={selectedSantri} records={records} />
            </div>

            {/* Riwayat Mutaba'ah Setoran Al-Quran Santri */}
            <div className="p-5 pt-0 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  Buku Catatan Setoran Al-Qur'an (Mutaba'ah)
                </h4>
                <span className="text-xs text-slate-500">
                  Riwayat Hari, Tanggal, Tajwid, &amp; Kelancaran
                </span>
              </div>

              {santriRecords.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">
                    Belum ada rekaman setoran untuk santri ini
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Silakan klik tombol "+ Setoran" di atas untuk mencatat setoran pertama
                  </p>
                  <button
                    onClick={() => onOpenNewSetoranForSantri(selectedSantri)}
                    className="mt-3 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-600 transition-colors"
                  >
                    + Catat Setoran Baru
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {santriRecords.map((rec) => {
                    const passedTajwid = Object.values(rec.aspekTajwid).filter(Boolean).length;
                    return (
                      <div
                        key={rec.id}
                        className="bg-slate-50 hover:bg-emerald-50/40 p-4 rounded-xl border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        {/* Waktu & Surah */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {rec.hari}
                            </span>
                            <span className="text-xs text-slate-600 font-semibold">
                              {formatTanggalIndo(rec.tanggal)}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              rec.jenis === 'Rasmi’ / Tasmi’ Al-Qur\'an'
                                ? 'bg-amber-100 text-emerald-950 border border-amber-300'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {rec.jenis}
                            </span>
                          </div>

                          <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 pt-0.5">
                            <BookOpen className="w-4 h-4 text-emerald-600" />
                            <span>Surah {rec.surah} : Ayat {rec.ayatMulai} - {rec.ayatSelesai} (Juz {rec.juz})</span>
                          </div>

                          {/* Tajwid & Kelancaran Summary */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                            <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                              Kelancaran: <strong>{rec.kelancaran}</strong> ({rec.salahTerhentiCount}x salah)
                            </span>
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                              Tajwid: <strong>{passedTajwid}/6 Aspek</strong>
                            </span>
                            {(rec.kesalahanMakhraj !== undefined || rec.kesalahanMad !== undefined || rec.kesalahanTajwidCount !== undefined) && (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold text-[11px]" title="Koreksi Tasmi': Makhorijul Huruf, Mad, Tajwid (Bukan Perkata)">
                                Tasmi’: Makhraj ({rec.kesalahanMakhraj || 0}) • Mad ({rec.kesalahanMad || 0}) • Tajwid ({rec.kesalahanTajwidCount || 0})
                              </span>
                            )}
                          </div>

                          {rec.catatanTajwid && (
                            <p className="text-[11px] text-slate-600 italic">
                              Tajwid: "{rec.catatanTajwid}"
                            </p>
                          )}
                        </div>

                        {/* Nilai & Action */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 gap-2">
                          <div className="text-right">
                            <div className="text-lg font-extrabold text-slate-900">
                              {rec.nilaiAngka}
                            </div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              {rec.predikat} • {rec.status}
                            </span>
                          </div>

                          <button
                            onClick={() => onViewRecordDetail(rec)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-white hover:bg-emerald-100 rounded-md border border-slate-300 transition-colors"
                          >
                            Lihat Detail
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            Pilih santri di kolom sebelah kiri untuk melihat buku mutaba'ah
          </div>
        )}
      </div>
    </div>
  );
};
