import React from 'react';
import { 
  X, 
  Printer, 
  Award, 
  Download, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  ShieldCheck,
  Calendar,
  Share2
} from 'lucide-react';
import { SertifikatTahfidz } from '../types';
import { JUZ_METADATA_LIST } from '../data/quranData';

interface CertificateViewModalProps {
  certificate: SertifikatTahfidz | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateViewModal: React.FC<CertificateViewModalProps> = ({
  certificate,
  isOpen,
  onClose
}) => {
  if (!isOpen || !certificate) return null;

  const juzMeta = JUZ_METADATA_LIST.find(j => j.juzNumber === certificate.juzUtama);

  const handlePrint = () => {
    document.body.classList.add('printing-certificate');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-certificate');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0">
      <div className="bg-slate-900 rounded-2xl max-w-5xl w-full shadow-2xl border border-emerald-500/30 overflow-hidden flex flex-col my-auto max-h-[96vh] print:max-h-none print:border-none print:shadow-none print:bg-transparent">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-emerald-900/60 flex items-center justify-between text-white shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-800 text-amber-300 border border-emerald-600/40">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-emerald-100 flex items-center gap-2">
                Pratinjau Syahadah Tahfidz Al-Qur'an
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950">
                  {certificate.namaJuz}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Nomor: <span className="font-mono text-emerald-300">{certificate.nomorSertifikat}</span> • {certificate.santriNama}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-3 sm:p-6 overflow-y-auto bg-slate-950 flex justify-center print:p-0 print:overflow-visible print:bg-white">
          
          {/* A4 Landscape Printable Certificate Sheet */}
          <div 
            id="certificate-print-area"
            className="w-full max-w-[1000px] aspect-[1.414/1] bg-white text-slate-900 rounded-lg p-5 sm:p-8 relative shadow-2xl overflow-hidden flex flex-col justify-between border-8 border-emerald-900 print:shadow-none print:rounded-none print:w-full print:h-full print:border-8 print:border-emerald-900"
            style={{
              backgroundImage: 'radial-gradient(circle at center, #ffffff 0%, #fbfbf7 100%)'
            }}
          >
            {/* Islamic Outer Frame with Gold & Emerald Dual Lines */}
            <div className="absolute inset-2 sm:inset-3 border-2 border-amber-500/80 pointer-events-none rounded-sm"></div>
            <div className="absolute inset-3 sm:inset-4 border border-emerald-900/40 pointer-events-none"></div>

            {/* Arabesque Corner Ornaments */}
            {/* Top-Left */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-12 h-12 pointer-events-none text-amber-500">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-90">
                <path d="M0,0 L40,0 C30,10 30,30 20,40 C10,30 0,30 0,0 Z" />
                <circle cx="15" cy="15" r="5" />
                <path d="M0,0 L0,40 C10,30 30,30 40,20 C30,10 30,0 0,0 Z" />
              </svg>
            </div>
            {/* Top-Right */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-12 h-12 pointer-events-none text-amber-500 rotate-90">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-90">
                <path d="M0,0 L40,0 C30,10 30,30 20,40 C10,30 0,30 0,0 Z" />
                <circle cx="15" cy="15" r="5" />
                <path d="M0,0 L0,40 C10,30 30,30 40,20 C30,10 30,0 0,0 Z" />
              </svg>
            </div>
            {/* Bottom-Left */}
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-12 h-12 pointer-events-none text-amber-500 -rotate-90">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-90">
                <path d="M0,0 L40,0 C30,10 30,30 20,40 C10,30 0,30 0,0 Z" />
                <circle cx="15" cy="15" r="5" />
                <path d="M0,0 L0,40 C10,30 30,30 40,20 C30,10 30,0 0,0 Z" />
              </svg>
            </div>
            {/* Bottom-Right */}
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-12 h-12 pointer-events-none text-amber-500 rotate-180">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-90">
                <path d="M0,0 L40,0 C30,10 30,30 20,40 C10,30 0,30 0,0 Z" />
                <circle cx="15" cy="15" r="5" />
                <path d="M0,0 L0,40 C10,30 30,30 40,20 C30,10 30,0 0,0 Z" />
              </svg>
            </div>

            {/* Background Watermark Emblem */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035]">
              <div className="w-96 h-96 rounded-full border-[18px] border-emerald-900 flex items-center justify-center">
                <BookOpen className="w-56 h-56 text-emerald-950" />
              </div>
            </div>

            {/* Header Section */}
            <div className="text-center relative z-10 pt-1 sm:pt-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-emerald-900 flex items-center justify-center text-amber-300 font-bold text-xs shadow-xs">
                  ۞
                </div>
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-emerald-900 uppercase">
                  {certificate.namaLembaga} • Lembaga Tahfidz Al-Qur'an
                </span>
                <div className="w-7 h-7 rounded-full bg-emerald-900 flex items-center justify-center text-amber-300 font-bold text-xs shadow-xs">
                  ۞
                </div>
              </div>

              {/* Bismillah Calligraphy */}
              <p className="font-serif text-lg sm:text-2xl text-emerald-950 font-bold tracking-wider my-1 sm:my-1.5" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>

              {/* Certificate Main Title */}
              <div className="relative inline-block my-0.5">
                <h1 className="text-xl sm:text-3xl font-extrabold text-emerald-900 tracking-wider uppercase font-serif drop-shadow-2xs">
                  SYAHADAH TAHFIDZ AL-QUR'AN
                </h1>
                <p className="font-serif text-xs sm:text-sm text-amber-700 font-bold mt-0.5" dir="rtl">
                  شَهَادَةُ حِفْظِ الْقُرْآنِ الْكَرِيمِ
                </p>
                <div className="h-0.5 w-36 sm:w-56 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-1"></div>
              </div>

              <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide mt-1">
                Nomor Sertifikat: <span className="font-mono font-bold text-slate-800">{certificate.nomorSertifikat}</span>
              </p>
            </div>

            {/* Recipient Body */}
            <div className="text-center relative z-10 my-auto py-2 sm:py-3 space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 italic">
                Dengan senantiasa memohon taufiq dan ridho Allah Subhanahu wa Ta'ala, menyatakan bahwa:
              </p>

              {/* Santri Name in Majestic Display */}
              <div className="py-1">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-emerald-950 tracking-wide font-serif border-b-2 border-amber-400/70 inline-block px-8 pb-1">
                  {certificate.santriNama}
                </h2>
                <div className="flex items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-slate-700 font-semibold mt-2">
                  <span>NIS: <strong className="text-slate-900">{certificate.santriNis}</strong></span>
                  <span>•</span>
                  <span>Kelas: <strong className="text-slate-900">{certificate.santriKelas}</strong></span>
                  <span>•</span>
                  <span>Halaqah: <strong className="text-slate-900">{certificate.santriHalaqah}</strong></span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
                Telah berhasil menyelesaikan hafalan dan dinyatakan <strong>LULUS</strong> dalam{' '}
                <strong className="text-emerald-900">Ujian Tasmi’ / Rasmi’ Al-Qur'an Bil-Ghaib Sekali Duduk</strong> untuk capaian:
              </p>

              {/* Capaian Juz Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white shadow-md border border-amber-400">
                <Award className="w-5 h-5 text-amber-300" />
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 block font-semibold leading-none">
                    Khatam Hafalan
                  </span>
                  <span className="text-sm sm:text-lg font-extrabold text-white tracking-wide">
                    {certificate.namaJuz}
                  </span>
                </div>
                {juzMeta && (
                  <span className="font-serif text-xs sm:text-sm text-amber-200 border-l border-emerald-700 pl-3 hidden sm:inline" dir="rtl">
                    {juzMeta.arabicName}
                  </span>
                )}
              </div>

              {/* Rincian Evaluasi Tasmi' / Rasmi' (Makhorijul Huruf, Mad, Tajwid, Kelancaran) */}
              <div className="max-w-2xl mx-auto bg-emerald-50/70 rounded-xl p-2.5 sm:p-3 border border-emerald-200/90 text-xs">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5 mb-2">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Pengoreksian Tasmi’ Al-Qur'an (Tajwid • Makhraj • Mad — Bukan Perkata):
                  </span>
                  <span className="text-emerald-900 font-extrabold text-xs sm:text-sm">
                    Nilai Akhir: <strong className="text-emerald-950 font-black">{certificate.nilaiAkhir}</strong> ({certificate.predikat})
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-1.5 rounded-lg border border-emerald-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block">Makhorijul Huruf</span>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900">{certificate.nilaiMakhraj}</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-teal-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block">Ahkamul Mad</span>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900">{certificate.nilaiMad}</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-amber-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block">Kaidah Tajwid</span>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900">{certificate.nilaiTajwid}</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block">Kelancaran</span>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900">{certificate.nilaiKelancaran}</span>
                  </div>
                </div>
              </div>

              {/* Doa / Ayat */}
              <p className="text-[10px] sm:text-xs text-slate-500 italic max-w-xl mx-auto">
                "{certificate.catatanDoa || 'Semoga Allah menjaga hafalan Al-Qur\'an Ananda, menjadikannya penyejuk hati dan syafa\'at di yaumil akhir.'}"
              </p>
            </div>

            {/* Footer Signatures & Official Stamp */}
            <div className="relative z-10 pt-2 border-t border-slate-200 mt-1">
              <div className="flex items-center justify-between text-xs sm:text-sm px-4 sm:px-8">
                
                {/* Left Signature: Examiner / Penguji Tasmi' */}
                <div className="text-center w-48 sm:w-64">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Penguji Ujian Tasmi’ / Rasmi’:</span>
                  <div className="h-12 sm:h-16 flex items-center justify-center">
                    <span className="font-serif italic text-emerald-800 text-sm opacity-80 select-none">
                      (Tanda Tangan Penguji)
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm border-t border-slate-400 pt-1">
                    {certificate.namaPenguji}
                  </p>
                  <span className="text-[10px] text-slate-500 block">Koordinator Tahfidz Al-Qur'an</span>
                </div>

                {/* Center: Official Gold Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-amber-500 bg-amber-50 flex items-center justify-center text-center p-1 shadow-inner relative">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-amber-600 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex flex-col items-center justify-center text-[8px] sm:text-[9px] font-black uppercase tracking-tight shadow-md">
                      <span>★ LULUS ★</span>
                      <span className="text-[7px] sm:text-[8px] font-bold">TASMI’ JUZ</span>
                      <span className="font-extrabold text-[10px]">{certificate.juzUtama}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-amber-800 mt-1 uppercase tracking-widest">
                    CAP RESMI LPTQ
                  </span>
                </div>

                {/* Right Signature: Headmaster / Kepala Sekolah */}
                <div className="text-center w-48 sm:w-64">
                  <span className="text-[11px] text-slate-500 block mb-0.5">
                    {certificate.kota}, {certificate.tanggalMasehi}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold block mb-0.5">
                    {certificate.tanggalHijriyah}
                  </span>
                  <div className="h-10 sm:h-14 flex items-center justify-center">
                    <span className="font-serif italic text-emerald-800 text-sm opacity-80 select-none">
                      (Tanda Tangan Kepala Sekolah)
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm border-t border-slate-400 pt-1">
                    {certificate.namaKepalaSekolah}
                  </p>
                  <span className="text-[10px] text-slate-500 block">Kepala Sekolah {certificate.namaLembaga}</span>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Actions (Hidden on print) */}
        <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Format sertifikat dioptimalkan untuk ukuran kertas landscape A4 (Full Color)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Syahadah Sekarang</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
