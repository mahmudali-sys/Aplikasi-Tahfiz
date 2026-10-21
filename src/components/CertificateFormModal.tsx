import React, { useState, useEffect } from 'react';
import { 
  X, 
  Award, 
  User, 
  Calendar, 
  Check, 
  BookOpen, 
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Santri, SertifikatTahfidz, CapaianJuz, PredikatNilai } from '../types';
import { 
  JUZ_METADATA_LIST, 
  formatTanggalIndo, 
  getHijriDateApprox, 
  calculatePredikat 
} from '../data/quranData';

interface CertificateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cert: SertifikatTahfidz) => void;
  santriList: Santri[];
  initialData?: SertifikatTahfidz | null;
  defaultSantriId?: string;
  defaultJuz?: CapaianJuz;
}

export const CertificateFormModal: React.FC<CertificateFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  santriList,
  initialData,
  defaultSantriId,
  defaultJuz = 30
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [santriId, setSantriId] = useState<string>(
    initialData?.santriId || defaultSantriId || (santriList[0]?.id ?? '')
  );
  const [juzUtama, setJuzUtama] = useState<CapaianJuz>(
    initialData?.juzUtama || defaultJuz || 30
  );
  
  // Scoring parameters based on Rasmi' evaluation
  const [nilaiMakhraj, setNilaiMakhraj] = useState<number>(initialData?.nilaiMakhraj || 95);
  const [nilaiMad, setNilaiMad] = useState<number>(initialData?.nilaiMad || 94);
  const [nilaiTajwid, setNilaiTajwid] = useState<number>(initialData?.nilaiTajwid || 95);
  const [nilaiKelancaran, setNilaiKelancaran] = useState<number>(initialData?.nilaiKelancaran || 96);
  const [nilaiAkhir, setNilaiAkhir] = useState<number>(initialData?.nilaiAkhir || 95);

  // Institution & Date Metadata
  const [nomorSertifikat, setNomorSertifikat] = useState<string>(
    initialData?.nomorSertifikat || `0${Math.floor(Math.random() * 50) + 40}/STQ/SMPIA9/X/2026`
  );
  const [tanggalInput, setTanggalInput] = useState<string>(todayStr);
  const [tanggalMasehi, setTanggalMasehi] = useState<string>(
    initialData?.tanggalMasehi || formatTanggalIndo(todayStr)
  );
  const [tanggalHijriyah, setTanggalHijriyah] = useState<string>(
    initialData?.tanggalHijriyah || getHijriDateApprox(todayStr)
  );
  const [kota, setKota] = useState<string>(initialData?.kota || 'Bekasi');
  const [namaLembaga, setNamaLembaga] = useState<string>(
    initialData?.namaLembaga || 'SMP Islam Al Azhar 9'
  );
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState<string>(
    initialData?.namaKepalaSekolah || 'Drs. H. Ahmad Dahlan, M.Pd'
  );
  const [namaPenguji, setNamaPenguji] = useState<string>(
    initialData?.namaPenguji || 'Ustadz Abdullah, S.Pd.I, Al-Hafizh'
  );
  const [catatanDoa, setCatatanDoa] = useState<string>(
    initialData?.catatanDoa || 'Semoga Allah menjaga hafalan Al-Qur\'an Ananda, menjadikannya penyejuk hati dan syafa\'at di yaumil akhir.'
  );

  const selectedSantri = santriList.find(s => s.id === santriId);
  const selectedJuzMeta = JUZ_METADATA_LIST.find(j => j.juzNumber === juzUtama);

  // Auto calculate average score
  useEffect(() => {
    const avg = Math.round((nilaiMakhraj + nilaiMad + nilaiTajwid + nilaiKelancaran) / 4);
    setNilaiAkhir(avg);
  }, [nilaiMakhraj, nilaiMad, nilaiTajwid, nilaiKelancaran]);

  // Update date strings when input changes
  const handleDateChange = (val: string) => {
    setTanggalInput(val);
    setTanggalMasehi(formatTanggalIndo(val));
    setTanggalHijriyah(getHijriDateApprox(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSantri) return;

    const predikat: PredikatNilai = calculatePredikat(nilaiAkhir);
    const namaJuz = selectedJuzMeta?.name || `Juz ${juzUtama}`;

    const cert: SertifikatTahfidz = {
      id: initialData?.id || `cert-${Date.now()}`,
      nomorSertifikat: nomorSertifikat.trim(),
      santriId: selectedSantri.id,
      santriNama: selectedSantri.nama,
      santriNis: selectedSantri.nis,
      santriKelas: selectedSantri.kelas,
      santriHalaqah: selectedSantri.halaqah,
      juzSelesai: [juzUtama],
      juzUtama,
      namaJuz,
      nilaiAkhir,
      predikat,
      nilaiMakhraj,
      nilaiMad,
      nilaiTajwid,
      nilaiKelancaran,
      tanggalMasehi,
      tanggalHijriyah,
      kota,
      namaLembaga,
      namaKepalaSekolah,
      namaPenguji,
      catatanDoa,
      createdAt: initialData?.createdAt || new Date().toISOString()
    };

    onSave(cert);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 to-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {initialData ? 'Edit Syahadah Tahfidz' : 'Penerbitan Syahadah Tahfidz Al-Qur\'an'}
              </h2>
              <p className="text-xs text-emerald-200">
                Penerbitan sertifikat kelulusan ujian Rasmi’ Al-Qur'an (Juz 30, 29, 28, 27, 26)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          
          {/* Section 1: Santri & Pilihan Juz yang Diselesaikan */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-emerald-700" /> Penerima Sertifikat &amp; Capaian Juz
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Santri Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Pilih Santri yang Lulus <span className="text-red-500">*</span>
                </label>
                <select
                  value={santriId}
                  onChange={(e) => setSantriId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                >
                  {santriList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.kelas} - {s.halaqah})
                    </option>
                  ))}
                </select>
                {selectedSantri && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    NIS: {selectedSantri.nis} • Pembimbing: {selectedSantri.pembimbing}
                  </p>
                )}
              </div>

              {/* Nomor Sertifikat */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nomor Sertifikat Resmi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nomorSertifikat}
                  onChange={(e) => setNomorSertifikat(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. 042/STQ/SMPIA9/X/2026"
                  required
                />
              </div>
            </div>

            {/* Pilihan Capaian Juz (30, 29, 28, 27, 26) */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Pilih Juz yang Telah Diselesaikan &amp; Lulus Ujian Rasmi' <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {([30, 29, 28, 27, 26] as CapaianJuz[]).map((jNum) => {
                  const meta = JUZ_METADATA_LIST.find(m => m.juzNumber === jNum);
                  const isSelected = juzUtama === jNum;
                  return (
                    <button
                      type="button"
                      key={jNum}
                      onClick={() => setJuzUtama(jNum)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-950 shadow-md ring-2 ring-amber-400'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm">Juz {jNum}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" />}
                        </div>
                        <p className={`text-[11px] font-semibold mt-0.5 ${isSelected ? 'text-amber-200' : 'text-emerald-800'}`}>
                          {meta?.title}
                        </p>
                      </div>
                      <span className={`text-[9px] mt-1.5 block ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {meta?.surahCount} Surah
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedJuzMeta && (
                <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <span>Cakupan: <strong>{selectedJuzMeta.deskripsi}</strong></span>
                  <span className="font-serif font-bold text-sm text-emerald-950 ml-2" dir="rtl">
                    {selectedJuzMeta.arabicName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Rincian Penilaian Ujian Rasmi' Al-Qur'an (Bukan Perkata) */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-emerald-950 flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Rincian Nilai Ujian Rasmi’ Al-Qur'an (0-100)
              </h3>
              <span className="text-xs text-emerald-800 font-medium">Berdasarkan Makhraj, Mad, &amp; Tajwid</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Makhorijul Huruf
                </label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={nilaiMakhraj}
                  onChange={(e) => setNilaiMakhraj(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-center font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ahkamul Mad &amp; Qashr
                </label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={nilaiMad}
                  onChange={(e) => setNilaiMad(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-center font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kaidah Tajwid
                </label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={nilaiTajwid}
                  onChange={(e) => setNilaiTajwid(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-center font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelancaran Hafalan
                </label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={nilaiKelancaran}
                  onChange={(e) => setNilaiKelancaran(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-center font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Nilai Akhir Showcase */}
            <div className="bg-white p-3 rounded-lg border border-emerald-300 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Nilai Akhir Ujian Rasmi’:</span>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={nilaiAkhir}
                  onChange={(e) => setNilaiAkhir(parseInt(e.target.value) || 0)}
                  className="w-16 text-center font-extrabold text-base border border-slate-300 rounded px-1 py-0.5 text-emerald-900"
                />
                <span className="font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  {calculatePredikat(nilaiAkhir)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Legalitas, Tanggal, & Penandatangan */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-emerald-700" /> Tanggal Penerbitan &amp; Pejabat Penandatangan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Pilih Tanggal Terbit
                </label>
                <input
                  type="date"
                  value={tanggalInput}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Tanggal Masehi
                </label>
                <input
                  type="text"
                  value={tanggalMasehi}
                  onChange={(e) => setTanggalMasehi(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Tanggal Hijriyah
                </label>
                <input
                  type="text"
                  value={tanggalHijriyah}
                  onChange={(e) => setTanggalHijriyah(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Kota Penerbitan
                </label>
                <input
                  type="text"
                  value={kota}
                  onChange={(e) => setKota(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Kepala Sekolah / Pimpinan
                </label>
                <input
                  type="text"
                  value={namaKepalaSekolah}
                  onChange={(e) => setNamaKepalaSekolah(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Penguji Ujian Rasmi’
                </label>
                <input
                  type="text"
                  value={namaPenguji}
                  onChange={(e) => setNamaPenguji(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Doa / Pesan Motivasi Khatam Al-Qur'an
              </label>
              <textarea
                rows={2}
                value={catatanDoa}
                onChange={(e) => setCatatanDoa(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md active:scale-95 transition-all"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Simpan &amp; Terbitkan Syahadah</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
