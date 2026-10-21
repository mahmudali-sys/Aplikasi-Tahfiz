import React from 'react';
import { 
  X, 
  BookOpen, 
  Calendar, 
  Check, 
  XCircle, 
  Award, 
  Sparkles, 
  User, 
  Clock, 
  Printer, 
  MessageSquareQuote
} from 'lucide-react';
import { SetoranRecord } from '../types';
import { formatTanggalIndo, SURAH_LIST } from '../data/quranData';

interface DetailSetoranModalProps {
  record: SetoranRecord | null;
  onClose: () => void;
  onPrintSingle: (record: SetoranRecord) => void;
}

export const DetailSetoranModal: React.FC<DetailSetoranModalProps> = ({
  record,
  onClose,
  onPrintSingle
}) => {
  if (!record) return null;

  const surahInfo = SURAH_LIST.find(s => s.name === record.surah);

  const tajwidLabels = [
    { key: 'makhraj' as const, label: 'Makharijul Huruf (Keluarnya Huruf)', desc: 'Halq, Lisan, Syafatain, Khaisyum' },
    { key: 'mad' as const, label: 'Ahkamul Mad & Qashr (Panjang Pendek)', desc: 'Mad Thabi\'i 2 harakat & Far\'i' },
    { key: 'shifat' as const, label: 'Shifatul Huruf (Karakter Huruf)', desc: 'Qalqalah, Hams, Tafkhim/Tarqiq' },
    { key: 'nunTanwin' as const, label: 'Hukum Nun Sakinah & Tanwin', desc: 'Idzhar, Idgham, Ikhfa, Iqlab' },
    { key: 'gunnah' as const, label: 'Ghunnah Musyaddadah & Mim Mati', desc: 'Dengung 2 harakat yang sempurna' },
    { key: 'waqaf' as const, label: 'Waqaf & Ibtida\' (Berhenti/Memulai)', desc: 'Tidak memotong kata di luar tanda' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300 border border-emerald-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-800 text-amber-200 font-semibold">
                  {record.jenis}
                </span>
                <span className="text-xs text-emerald-200">
                  {record.hari}, {formatTanggalIndo(record.tanggal)}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Surah {record.surah} (Ayat {record.ayatMulai} - {record.ayatSelesai})
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Identitas Santri & Nilai Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Identitas Santri</span>
              <p className="text-base font-bold text-slate-900">{record.santriNama}</p>
              <div className="text-xs text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
                <span>Kelas: <strong>{record.santriKelas}</strong></span>
                <span>Juz Al-Qur'an: <strong>Juz {record.juz}</strong></span>
                {record.waktu && <span>Waktu: <strong>{record.waktu}</strong></span>}
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Pembimbing: <strong>{record.pembimbing}</strong>
              </p>
            </div>

            {/* Nilai Showcase */}
            <div className="flex flex-col items-center justify-center bg-white p-3 rounded-lg border border-slate-200 text-center">
              <span className="text-xs font-semibold text-slate-500">Nilai Akhir</span>
              <span className="text-3xl font-extrabold text-emerald-800">{record.nilaiAngka}</span>
              <span className="text-xs font-bold px-2 py-0.5 mt-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                {record.predikat}
              </span>
              <span className={`text-[11px] font-semibold mt-1 px-2 py-0.5 rounded-full ${
                record.status === "Ulang (I'adah)" ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Status: {record.status}
              </span>
            </div>
          </div>

          {/* Bagian 1: Hasil Pencatatan Kelancaran Bacaan */}
          <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-teal-950 flex items-center gap-1.5 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-teal-700" /> Hasil Penilaian Kelancaran Bacaan
              </h4>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300">
                {record.kelancaran}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                <span className="text-slate-500 block text-[11px]">Tingkat Kelancaran</span>
                <span className="font-bold text-slate-800">{record.kelancaran}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                <span className="text-slate-500 block text-[11px]">Jumlah Terhenti / Tawaqquf</span>
                <span className="font-bold text-slate-800">
                  {record.salahTerhentiCount === 0 ? '0 kali (Sangat Lancar / Mutqin)' : `${record.salahTerhentiCount} kali diingatkan`}
                </span>
              </div>
            </div>

            {record.catatanKelancaran && (
              <div className="bg-white p-3 rounded-lg border border-teal-200 text-xs">
                <span className="font-semibold text-teal-900 block mb-0.5">Catatan Kelancaran:</span>
                <p className="text-slate-700 italic">"{record.catatanKelancaran}"</p>
              </div>
            )}
          </div>

          {/* Bagian 2: Hasil Pencatatan Tajwid Santri */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-xs sm:text-sm">
                <Award className="w-4 h-4 text-amber-700" /> Hasil Penilaian Tajwid Santri
              </h4>
              <span className="text-xs text-amber-800">
                {Object.values(record.aspekTajwid).filter(Boolean).length} dari 6 Aspek Dikuasai
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tajwidLabels.map((item) => {
                const passed = record.aspekTajwid[item.key];
                return (
                  <div 
                    key={item.key}
                    className={`flex items-start gap-2 p-2 rounded-lg border text-xs ${
                      passed 
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-800' 
                        : 'bg-rose-50/60 border-rose-200 text-slate-600'
                    }`}
                  >
                    <div className={`mt-0.5 rounded-full p-0.5 ${
                      passed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    </div>
                    <div>
                      <p className="font-bold text-[11px] leading-tight">{item.label}</p>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {record.catatanTajwid && (
              <div className="bg-white p-3 rounded-lg border border-amber-200 text-xs">
                <span className="font-semibold text-amber-950 block mb-0.5">Catatan Tajwid Spesifik:</span>
                <p className="text-slate-800">{record.catatanTajwid}</p>
              </div>
            )}
          </div>

          {/* Bagian 2B: Rincian Pengoreksian Tasmi’ / Rasmi’ Al-Qur'an (Makhorijul Huruf, Mad, Tajwid - Bukan Perkata) */}
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs sm:text-sm">
                <Award className="w-4 h-4 text-emerald-700" /> Rincian Pengoreksian Tasmi’ Al-Qur'an
              </h4>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-800 text-amber-300">
                Sesuai Tajwid, Makhraj &amp; Mad (Bukan Perkata)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-xs">
                <span className="text-slate-500 block text-[11px] font-semibold">1. Makhorijul Huruf</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-extrabold text-emerald-800">
                    {record.kesalahanMakhraj !== undefined ? record.kesalahanMakhraj : 0}
                  </span>
                  <span className="text-[10px] text-slate-500">kesalahan artikulasi</span>
                </div>
                {record.catatanMakhraj && (
                  <p className="text-[11px] text-emerald-900 mt-1 italic border-t border-slate-100 pt-1">
                    "{record.catatanMakhraj}"
                  </p>
                )}
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-teal-200 text-xs">
                <span className="text-slate-500 block text-[11px] font-semibold">2. Ahkamul Mad &amp; Qashr</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-extrabold text-teal-800">
                    {record.kesalahanMad !== undefined ? record.kesalahanMad : 0}
                  </span>
                  <span className="text-[10px] text-slate-500">kesalahan harakat</span>
                </div>
                {record.catatanMad && (
                  <p className="text-[11px] text-teal-900 mt-1 italic border-t border-slate-100 pt-1">
                    "{record.catatanMad}"
                  </p>
                )}
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-amber-200 text-xs">
                <span className="text-slate-500 block text-[11px] font-semibold">3. Kaidah Tajwid</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-extrabold text-amber-800">
                    {record.kesalahanTajwidCount !== undefined ? record.kesalahanTajwidCount : 0}
                  </span>
                  <span className="text-[10px] text-slate-500">kesalahan hukum</span>
                </div>
                {record.catatanTajwid && (
                  <p className="text-[11px] text-amber-900 mt-1 italic border-t border-slate-100 pt-1">
                    "{record.catatanTajwid}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bagian 3: Pesan Ustadz */}
          {record.catatanUstadz && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs flex items-start gap-2.5">
              <MessageSquareQuote className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Nasehat / Catatan Ustadz:</span>
                <p className="text-slate-700 italic">"{record.catatanUstadz}"</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onPrintSingle(record)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 transition-colors"
          >
            <Printer className="w-4 h-4" /> Cetak Lembar Ini
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
