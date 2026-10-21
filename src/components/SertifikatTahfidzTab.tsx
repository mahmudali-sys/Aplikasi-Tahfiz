import React, { useState } from 'react';
import { 
  Award, 
  Printer, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  FileText, 
  Filter, 
  UserCheck,
  Sparkles,
  Trash2,
  Edit,
  ExternalLink
} from 'lucide-react';
import { Santri, SertifikatTahfidz, CapaianJuz, SetoranRecord } from '../types';
import { JUZ_METADATA_LIST } from '../data/quranData';

interface SertifikatTahfidzTabProps {
  santriList: Santri[];
  certificates: SertifikatTahfidz[];
  records: SetoranRecord[];
  onOpenCreateCertificate: (santriId?: string, juz?: CapaianJuz) => void;
  onOpenEditCertificate: (cert: SertifikatTahfidz) => void;
  onViewCertificate: (cert: SertifikatTahfidz) => void;
  onDeleteCertificate: (certId: string) => void;
  onToggleJuzStatus: (santriId: string, juz: CapaianJuz) => void;
}

export const SertifikatTahfidzTab: React.FC<SertifikatTahfidzTabProps> = ({
  santriList,
  certificates,
  records,
  onOpenCreateCertificate,
  onOpenEditCertificate,
  onViewCertificate,
  onDeleteCertificate,
  onToggleJuzStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJuzFilter, setSelectedJuzFilter] = useState<string>('ALL');
  const [activeSection, setActiveSection] = useState<'arsip' | 'matriks'>('arsip');

  // Filtered certificates
  const filteredCertificates = certificates.filter(cert => {
    const matchSearch = 
      cert.santriNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.nomorSertifikat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.santriKelas.toLowerCase().includes(searchQuery.toLowerCase());
    const matchJuz = selectedJuzFilter === 'ALL' || cert.juzUtama.toString() === selectedJuzFilter;
    return matchSearch && matchJuz;
  });

  // Filtered santri for matrix
  const filteredSantri = santriList.filter(s => 
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.halaqah.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Hero Banner Sertifikat Tahfidz */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 rounded-2xl p-6 text-white shadow-lg border border-emerald-800/80 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 flex items-center justify-center pointer-events-none">
          <Award className="w-96 h-96 -mr-16 text-amber-300" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-amber-300 border border-emerald-600/50 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Penerbitan Syahadah Resmi Juz 30, 29, 28, 27, dan 26</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white font-serif">
            Sertifikat &amp; Syahadah Tahfidz Al-Qur'an
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Pemberian syahadah &amp; sertifikat resmi bagi santri yang telah menyelesaikan hafalan dan lulus{' '}
            <strong className="text-amber-300">Ujian Tasmi’ / Rasmi’ Al-Qur'an</strong> (dengan pengoreksian berbasis ketepatan 
            <strong> Bacaan Tajwid</strong>, <strong>Makhorijul Huruf</strong>, dan <strong>Ahkamul Mad</strong> — bukan perkata). 
            Dilengkapi pratinjau siap cetak format A4 landscape bernuansa Islami.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenCreateCertificate()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Terbitkan Syahadah Baru</span>
            </button>

            {/* Section Switcher Tabs */}
            <div className="bg-emerald-950/70 p-1 rounded-xl border border-emerald-800/80 flex items-center gap-1">
              <button
                onClick={() => setActiveSection('arsip')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeSection === 'arsip'
                    ? 'bg-emerald-800 text-amber-300 shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                Arsip Syahadah Diterbitkan ({certificates.length})
              </button>
              <button
                onClick={() => setActiveSection('matriks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeSection === 'matriks'
                    ? 'bg-emerald-800 text-amber-300 shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                Matriks Kelulusan Juz 26-30
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama santri, NIS, kelas, atau nomor sertifikat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="select-juz-filter" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Filter Capaian Juz:
          </label>
          <select
            id="select-juz-filter"
            value={selectedJuzFilter}
            onChange={(e) => setSelectedJuzFilter(e.target.value)}
            className="text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Juz (26 - 30)</option>
            <option value="30">Juz 30 (Juz 'Amma)</option>
            <option value="29">Juz 29 (Juz Tabarak)</option>
            <option value="28">Juz 28 (Juz Qad Sami'allah)</option>
            <option value="27">Juz 27 (Juz Qala Fama Khathbukum)</option>
            <option value="26">Juz 26 (Juz Ha Mim)</option>
          </select>
        </div>
      </div>

      {/* SECTION 1: ARSIP SERTIFIKAT DITERBITKAN */}
      {activeSection === 'arsip' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              Daftar Syahadah yang Telah Diterbitkan
              <span className="text-xs font-normal text-slate-500">
                ({filteredCertificates.length} Sertifikat)
              </span>
            </h3>
          </div>

          {filteredCertificates.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3">
              <Award className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                Belum ada sertifikat yang sesuai dengan pencarian atau filter.
              </p>
              <button
                onClick={() => onOpenCreateCertificate()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> Terbitkan Syahadah Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCertificates.map((cert) => {
                const juzMeta = JUZ_METADATA_LIST.find(j => j.juzNumber === cert.juzUtama);
                return (
                  <div
                    key={cert.id}
                    className="bg-white rounded-xl border border-slate-200/90 hover:border-emerald-500/80 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group"
                  >
                    {/* Top Decorative Border */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-700 via-amber-400 to-emerald-700"></div>

                    {/* Card Header */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {cert.nomorSertifikat}
                        </span>
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {cert.predikat} ({cert.nilaiAkhir})
                        </span>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors font-serif">
                          {cert.santriNama}
                        </h4>
                        <p className="text-xs text-slate-500">
                          NIS: {cert.santriNis} • Kelas {cert.santriKelas} ({cert.santriHalaqah})
                        </p>
                      </div>

                      {/* Capaian Juz Highlight */}
                      <div className="mt-3 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <span className="text-xs font-bold text-emerald-950">
                            {cert.namaJuz}
                          </span>
                        </div>
                        {juzMeta && (
                          <span className="font-serif text-xs font-bold text-emerald-900" dir="rtl">
                            {juzMeta.arabicName}
                          </span>
                        )}
                      </div>

                      {/* Penilaian Rasmi' Mini Breakdown */}
                      <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[10px]">
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                          <span className="text-slate-500 block">Makhraj</span>
                          <span className="font-bold text-slate-900">{cert.nilaiMakhraj}</span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                          <span className="text-slate-500 block">Mad</span>
                          <span className="font-bold text-slate-900">{cert.nilaiMad}</span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                          <span className="text-slate-500 block">Tajwid</span>
                          <span className="font-bold text-slate-900">{cert.nilaiTajwid}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-2.5 flex items-center gap-1">
                        <span>Penerbitan:</span>
                        <strong className="text-slate-600">{cert.tanggalMasehi}</strong>
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onViewCertificate(cert)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Lihat &amp; Cetak</span>
                      </button>

                      <button
                        onClick={() => onOpenEditCertificate(cert)}
                        className="p-2 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-slate-100 border border-slate-200 transition-colors"
                        title="Edit Data Sertifikat"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteCertificate(cert.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                        title="Hapus Sertifikat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: MATRIKS KELULUSAN JUZ 26-30 PER SANTRI */}
      {activeSection === 'matriks' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                Matriks Kelulusan Hafalan Juz 26 - 30
              </h3>
              <p className="text-xs text-slate-500">
                Pantau status khatam juz santri dan terbitkan sertifikat kelulusan dengan satu klik
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
              Target Kelulusan: Juz 30, 29, 28, 27, 26
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Santri &amp; Halaqah</th>
                  <th className="py-3 px-3 text-center">Juz 30 (Juz 'Amma)</th>
                  <th className="py-3 px-3 text-center">Juz 29 (Tabarak)</th>
                  <th className="py-3 px-3 text-center">Juz 28 (Qad Sami'allah)</th>
                  <th className="py-3 px-3 text-center">Juz 27 (Qala Fama)</th>
                  <th className="py-3 px-3 text-center">Juz 26 (Ha Mim)</th>
                  <th className="py-3 px-4 text-center">Total Capaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSantri.map((santri) => {
                  const completedJuzList = santri.juzLulus || [];

                  return (
                    <tr key={santri.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Santri Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs">
                            {santri.nama.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">{santri.nama}</p>
                            <p className="text-[11px] text-slate-500">
                              NIS: {santri.nis} • {santri.kelas} ({santri.halaqah})
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 5 Juz Pillars (30, 29, 28, 27, 26) */}
                      {([30, 29, 28, 27, 26] as CapaianJuz[]).map((jNum) => {
                        const isCompleted = completedJuzList.includes(jNum);
                        const existingCert = certificates.find(
                          c => c.santriId === santri.id && c.juzUtama === jNum
                        );

                        return (
                          <td key={jNum} className="py-3 px-2 text-center">
                            {isCompleted ? (
                              <div className="inline-flex flex-col items-center gap-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] border border-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                  Khatam
                                </span>
                                {existingCert ? (
                                  <button
                                    onClick={() => onViewCertificate(existingCert)}
                                    className="text-[10px] text-emerald-800 hover:text-emerald-950 font-semibold underline cursor-pointer"
                                  >
                                    Cetak Syahadah
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => onOpenCreateCertificate(santri.id, jNum)}
                                    className="text-[10px] text-amber-700 hover:text-amber-900 font-semibold underline cursor-pointer"
                                  >
                                    + Terbitkan
                                  </button>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => onToggleJuzStatus(santri.id, jNum)}
                                className="px-2 py-1 rounded text-[11px] font-medium text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 border border-dashed border-slate-200 hover:border-emerald-300 transition-all cursor-pointer"
                                title="Klik untuk menandai santri telah lulus juz ini"
                              >
                                Belum Selesai
                              </button>
                            )}
                          </td>
                        );
                      })}

                      {/* Total Score / Action */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-extrabold text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                          {completedJuzList.length} / 5 Juz
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
