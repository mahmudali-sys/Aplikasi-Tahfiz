import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  BookOpen, 
  Check, 
  Award, 
  AlertCircle, 
  User, 
  Hash, 
  Sparkles,
  Minus,
  Plus,
  HelpCircle
} from 'lucide-react';
import { Santri, SetoranRecord, JenisSetoran, TingkatKelancaran, StatusSetoran, AspekTajwid } from '../types';
import { SURAH_LIST, getHariFromDate, calculatePredikat } from '../data/quranData';

interface SetoranFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: SetoranRecord) => void;
  santriList: Santri[];
  initialData?: SetoranRecord | null;
}

export const SetoranFormModal: React.FC<SetoranFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  santriList,
  initialData
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  // Form State
  const [santriId, setSantriId] = useState<string>(initialData?.santriId || (santriList[0]?.id ?? ''));
  const [tanggal, setTanggal] = useState<string>(initialData?.tanggal || todayStr);
  const [hari, setHari] = useState<string>(initialData?.hari || getHariFromDate(todayStr));
  const [waktu, setWaktu] = useState<string>(initialData?.waktu || '07:30');
  const [jenis, setJenis] = useState<JenisSetoran>(initialData?.jenis || 'Tahfiz Ziyadah');
  
  // Al-Quran location
  const [selectedSurahName, setSelectedSurahName] = useState<string>(initialData?.surah || "An-Naba'");
  const [juz, setJuz] = useState<number>(initialData?.juz || 30);
  const [ayatMulai, setAyatMulai] = useState<number>(initialData?.ayatMulai || 1);
  const [ayatSelesai, setAyatSelesai] = useState<number>(initialData?.ayatSelesai || 10);

  // Kelancaran
  const [kelancaran, setKelancaran] = useState<TingkatKelancaran>(initialData?.kelancaran || 'Sangat Lancar');
  const [salahTerhentiCount, setSalahTerhentiCount] = useState<number>(initialData?.salahTerhentiCount || 0);
  const [catatanKelancaran, setCatatanKelancaran] = useState<string>(initialData?.catatanKelancaran || '');

  // Pengoreksian Tasmi' Al-Qur'an (Makhorijul Huruf, Ahkamul Mad, Kaidah Tajwid - Bukan Perkata)
  const [kesalahanMakhraj, setKesalahanMakhraj] = useState<number>(initialData?.kesalahanMakhraj || 0);
  const [catatanMakhraj, setCatatanMakhraj] = useState<string>(initialData?.catatanMakhraj || '');
  const [tagsKoreksiMakhraj, setTagsKoreksiMakhraj] = useState<string[]>(initialData?.tagsKoreksiMakhraj || []);

  const [kesalahanMad, setKesalahanMad] = useState<number>(initialData?.kesalahanMad || 0);
  const [catatanMad, setCatatanMad] = useState<string>(initialData?.catatanMad || '');
  const [tagsKoreksiMad, setTagsKoreksiMad] = useState<string[]>(initialData?.tagsKoreksiMad || []);

  const [kesalahanTajwidCount, setKesalahanTajwidCount] = useState<number>(initialData?.kesalahanTajwidCount || 0);
  const [catatanTajwid, setCatatanTajwid] = useState<string>(initialData?.catatanTajwid || '');
  const [tagsKoreksiTajwid, setTagsKoreksiTajwid] = useState<string[]>(initialData?.tagsKoreksiTajwid || []);

  const [isTasmiMode, setIsTasmiMode] = useState<boolean>(
    initialData?.isTasmiMode ?? (initialData?.jenis === 'Tasmi’ Al-Qur\'an')
  );

  // Tajwid checklist
  const [aspekTajwid, setAspekTajwid] = useState<AspekTajwid>(
    initialData?.aspekTajwid || {
      makhraj: true,
      mad: true,
      shifat: true,
      nunTanwin: true,
      gunnah: true,
      waqaf: true
    }
  );

  // Nilai
  const [nilaiAngka, setNilaiAngka] = useState<number>(initialData?.nilaiAngka || 90);
  const [status, setStatus] = useState<StatusSetoran>(initialData?.status || 'Lulus');
  const [pembimbing, setPembimbing] = useState<string>(initialData?.pembimbing || '');
  const [catatanUstadz, setCatatanUstadz] = useState<string>(initialData?.catatanUstadz || '');

  // Selected santri object
  const selectedSantri = santriList.find(s => s.id === santriId);

  // Update day when date changes
  useEffect(() => {
    if (tanggal) {
      setHari(getHariFromDate(tanggal));
    }
  }, [tanggal]);

  // Set default pembimbing if not set
  useEffect(() => {
    if (selectedSantri && (!pembimbing || !initialData)) {
      setPembimbing(selectedSantri.pembimbing);
    }
  }, [selectedSantri]);

  // When surah changes, update juz and suggest ayat
  const handleSurahChange = (surahName: string) => {
    setSelectedSurahName(surahName);
    const surahObj = SURAH_LIST.find(s => s.name === surahName);
    if (surahObj) {
      setJuz(surahObj.juzStart);
      setAyatMulai(1);
      setAyatSelesai(Math.min(10, surahObj.totalAyat));
    }
  };

  // Kalkulasi Pengoreksian Tasmi' Al-Qur'an:
  // Pengoreksian dihitung BUKAN perkata, melainkan dihitung sesuai kesalahan Tajwid, Makhraj, dan Mad
  const calculateTasmiScore = (
    makhrajErrors: number,
    madErrors: number,
    tajwidErrors: number,
    tawaqquf: number
  ) => {
    // Basis Skor 100
    // Pengurangan 2 poin per kesalahan Makhorijul Huruf
    // Pengurangan 2 poin per kesalahan Ahkamul Mad
    // Pengurangan 2 poin per kesalahan Kaidah Tajwid
    // Pengurangan 1 poin per Tawaqquf/Teguran Kelancaran
    const totalDeductions = (makhrajErrors * 2) + (madErrors * 2) + (tajwidErrors * 2) + (tawaqquf * 1);
    const calculated = Math.max(40, Math.min(100, 100 - totalDeductions));
    setNilaiAngka(calculated);

    if (calculated >= 80) setStatus('Lulus');
    else if (calculated >= 70) setStatus('Lanjut');
    else setStatus("Ulang (I'adah)");
  };

  // Quick tag helpers for examiner
  const handleAddMakhrajTag = (huruf: string) => {
    const updated = tagsKoreksiMakhraj.includes(huruf)
      ? tagsKoreksiMakhraj.filter(h => h !== huruf)
      : [...tagsKoreksiMakhraj, huruf];
    setTagsKoreksiMakhraj(updated);
    const count = updated.length;
    setKesalahanMakhraj(count);
    const newNote = updated.length > 0 ? `Koreksi makhraj huruf: ${updated.join(', ')}` : '';
    setCatatanMakhraj(newNote);
    calculateTasmiScore(count, kesalahanMad, kesalahanTajwidCount, salahTerhentiCount);
  };

  const handleAddMadTag = (madItem: string) => {
    const updated = tagsKoreksiMad.includes(madItem)
      ? tagsKoreksiMad.filter(m => m !== madItem)
      : [...tagsKoreksiMad, madItem];
    setTagsKoreksiMad(updated);
    const count = updated.length;
    setKesalahanMad(count);
    const newNote = updated.length > 0 ? `Koreksi mad: ${updated.join('; ')}` : '';
    setCatatanMad(newNote);
    calculateTasmiScore(kesalahanMakhraj, count, kesalahanTajwidCount, salahTerhentiCount);
  };

  const handleAddTajwidTag = (tajwidItem: string) => {
    const updated = tagsKoreksiTajwid.includes(tajwidItem)
      ? tagsKoreksiTajwid.filter(t => t !== tajwidItem)
      : [...tagsKoreksiTajwid, tajwidItem];
    setTagsKoreksiTajwid(updated);
    const count = updated.length;
    setKesalahanTajwidCount(count);
    const newNote = updated.length > 0 ? `Koreksi tajwid: ${updated.join('; ')}` : '';
    setCatatanTajwid(newNote);
    calculateTasmiScore(kesalahanMakhraj, kesalahanMad, count, salahTerhentiCount);
  };

  // Standard score suggestion for regular setoran
  const applyAutoScore = (kl: TingkatKelancaran, count: number, tajwidObj: AspekTajwid) => {
    let score = 95;
    if (kl === 'Sangat Lancar') score = 95 - Math.min(count * 2, 5);
    else if (kl === 'Lancar') score = 88 - Math.min(count * 2, 8);
    else if (kl === 'Cukup Lancar') score = 78 - Math.min(count * 2, 10);
    else score = 65 - Math.min(count * 2, 15);

    // Reduce for unchecked tajwid aspects
    const unCheckedTajwid = Object.values(tajwidObj).filter(v => !v).length;
    score -= unCheckedTajwid * 3;

    score = Math.max(50, Math.min(100, score));
    setNilaiAngka(score);

    if (score >= 80) setStatus('Lulus');
    else if (score >= 70) setStatus('Lanjut');
    else setStatus("Ulang (I'adah)");
  };

  const handleKelancaranChange = (val: TingkatKelancaran) => {
    setKelancaran(val);
    let defaultCount = salahTerhentiCount;
    if (val === 'Sangat Lancar' && salahTerhentiCount > 0) defaultCount = 0;
    if (val === 'Lancar' && salahTerhentiCount === 0) defaultCount = 1;
    if (val === 'Cukup Lancar' && salahTerhentiCount < 3) defaultCount = 3;
    if (val === 'Kurang Lancar' && salahTerhentiCount < 5) defaultCount = 5;
    setSalahTerhentiCount(defaultCount);
    
    if (isTasmiMode || jenis === 'Tasmi’ Al-Qur\'an') {
      calculateTasmiScore(kesalahanMakhraj, kesalahanMad, kesalahanTajwidCount, defaultCount);
    } else {
      applyAutoScore(val, defaultCount, aspekTajwid);
    }
  };

  const toggleAspekTajwid = (key: keyof AspekTajwid) => {
    const updated = { ...aspekTajwid, [key]: !aspekTajwid[key] };
    setAspekTajwid(updated);
    if (!isTasmiMode && jenis !== 'Tasmi’ Al-Qur\'an') {
      applyAutoScore(kelancaran, salahTerhentiCount, updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSantri) return;

    const predikat = calculatePredikat(nilaiAngka);

    const record: SetoranRecord = {
      id: initialData?.id || `rec-${Date.now()}`,
      santriId: selectedSantri.id,
      santriNama: selectedSantri.nama,
      santriKelas: selectedSantri.kelas,
      hari: hari || getHariFromDate(tanggal),
      tanggal,
      waktu,
      jenis,
      juz,
      surah: selectedSurahName,
      ayatMulai: Number(ayatMulai),
      ayatSelesai: Number(ayatSelesai),
      kelancaran,
      salahTerhentiCount: Number(salahTerhentiCount),
      catatanKelancaran,
      aspekTajwid,
      catatanTajwid,
      kesalahanMakhraj: Number(kesalahanMakhraj),
      catatanMakhraj,
      tagsKoreksiMakhraj,
      kesalahanMad: Number(kesalahanMad),
      catatanMad,
      tagsKoreksiMad,
      kesalahanTajwidCount: Number(kesalahanTajwidCount),
      tagsKoreksiTajwid,
      isTasmiMode,
      isRasmiMode: isTasmiMode,
      nilaiAngka: Number(nilaiAngka),
      predikat,
      status,
      pembimbing: pembimbing || selectedSantri.pembimbing,
      catatanUstadz,
      createdAt: initialData?.createdAt || new Date().toISOString()
    };

    onSave(record);
    onClose();
  };

  const activeSurah = SURAH_LIST.find(s => s.name === selectedSurahName);
  const currentPredikat = calculatePredikat(nilaiAngka);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {initialData ? 'Edit Laporan Setoran' : 'Catat Setoran Tahsin & Tahfiz'}
              </h2>
              <p className="text-xs text-emerald-200">
                Formulir pencatatan hari, tanggal, tajwid, kelancaran, dan nilai santri
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          
          {/* Section 1: Santri & Waktu Setoran (Hari & Tanggal) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-emerald-700" /> Data Santri &amp; Waktu Setoran
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Santri Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Pilih Santri <span className="text-red-500">*</span>
                </label>
                <select
                  id="form-santri-select"
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

              {/* Jenis Setoran */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Jenis Evaluasi / Setoran <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(['Tahsin', 'Tahfiz Ziyadah', 'Tahfiz Muroja\'ah', 'Tasmi’ Al-Qur\'an'] as JenisSetoran[]).map((j) => (
                    <button
                      type="button"
                      key={j}
                      onClick={() => {
                        setJenis(j);
                        if (j === 'Tasmi’ Al-Qur\'an') {
                          setIsTasmiMode(true);
                          calculateTasmiScore(kesalahanMakhraj, kesalahanMad, kesalahanTajwidCount, salahTerhentiCount);
                        }
                      }}
                      className={`px-2 py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                        jenis === j
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {j}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hari & Tanggal Setoran */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 border-t border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Tanggal Setoran <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="form-tanggal"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Hari Setoran (Otomatis)
                </label>
                <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-emerald-800">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>{hari || '-'}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Waktu / Sesi
                </label>
                <input
                  type="text"
                  placeholder="e.g. 07:15 / Ba'da Subuh"
                  value={waktu}
                  onChange={(e) => setWaktu(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Surah, Ayat, dan Juz */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-emerald-700" /> Materi Setoran Al-Qur'an
              </h3>
              {activeSurah && (
                <span className="text-sm font-serif font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {activeSurah.arabicName}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Surah Al-Qur'an <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSurahName}
                  onChange={(e) => handleSurahChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {SURAH_LIST.map((s) => (
                    <option key={s.number} value={s.name}>
                      {s.number}. {s.name} ({s.totalAyat} ayat)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ayat Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={activeSurah?.totalAyat || 300}
                  value={ayatMulai}
                  onChange={(e) => setAyatMulai(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ayat Selesai <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={ayatMulai}
                  max={activeSurah?.totalAyat || 300}
                  value={ayatSelesai}
                  onChange={(e) => setAyatSelesai(Math.max(ayatMulai, parseInt(e.target.value) || ayatMulai))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="font-semibold text-emerald-800">
                Juz: <input 
                  type="number" 
                  min={1} 
                  max={30} 
                  value={juz} 
                  onChange={(e) => setJuz(parseInt(e.target.value) || 30)}
                  className="w-14 px-1.5 py-0.5 border border-slate-300 rounded ml-1 text-center font-bold"
                />
              </span>
              <span>Total Ayat di Surah: <strong>{activeSurah?.totalAyat}</strong></span>
              <span>Rentang Setoran: <strong>{ayatSelesai - ayatMulai + 1} Ayat</strong></span>
            </div>
          </div>

          {/* Section 3: Fitur Kelancaran Bacaan */}
          <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-teal-900 flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-teal-700" /> Penilaian Kelancaran Bacaan
              </h3>
              <span className="text-xs text-teal-700">Tingkat kelancaran hafalan / tilawah</span>
            </div>

            {/* Skala Kelancaran */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Sangat Lancar', 'Lancar', 'Cukup Lancar', 'Kurang Lancar'] as TingkatKelancaran[]).map((level) => {
                const isSelected = kelancaran === level;
                return (
                  <button
                    type="button"
                    key={level}
                    onClick={() => handleKelancaranChange(level)}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50/40'
                    }`}
                  >
                    <span className="font-bold text-xs">{level}</span>
                    <span className={`text-[10px] mt-1 ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                      {level === 'Sangat Lancar' && 'Tanpa ragu / henti'}
                      {level === 'Lancar' && '1-2 teguran minor'}
                      {level === 'Cukup Lancar' && '3-4 kali diingatkan'}
                      {level === 'Kurang Lancar' && 'Terbata / banyak salah'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stepper Jumlah Terhenti / Salah */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-white p-3 rounded-lg border border-teal-200">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Jumlah Salah / Terhenti (Tawaqquf)
                </label>
                <span className="text-[11px] text-slate-500">Berapa kali santri diingatkan</span>
              </div>
              
              <div className="flex items-center gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(0, salahTerhentiCount - 1);
                    setSalahTerhentiCount(next);
                    applyAutoScore(kelancaran, next, aspekTajwid);
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="w-14 text-center">
                  <span className="text-lg font-bold text-teal-800">{salahTerhentiCount}</span>
                  <span className="text-[10px] block text-slate-500">kali</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = salahTerhentiCount + 1;
                    setSalahTerhentiCount(next);
                    applyAutoScore(kelancaran, next, aspekTajwid);
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Catatan kelancaran (misal: lancar tanpa ragu, sempat terhenti di ayat 7)"
                    value={catatanKelancaran}
                    onChange={(e) => setCatatanKelancaran(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Lembar Pengoreksian Tasmi’ Al-Qur'an (Makhorijul Huruf, Ahkamul Mad, Kaidah Tajwid - Bukan Perkata) */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 p-4 sm:p-5 rounded-2xl border-2 border-emerald-600/50 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-emerald-200/90 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-800 text-amber-300 shadow-xs">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-emerald-950 text-sm sm:text-base flex items-center gap-1.5 font-serif">
                      Lembar Pengoreksian Tasmi’ Al-Qur'an
                    </h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-700 text-white font-extrabold uppercase tracking-wider shadow-2xs">
                      Tidak Perkata
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-800 text-amber-300 font-bold">
                      Tajwid • Makhraj • Mad
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Pengoreksian langsung saat santri menyetor bacaan/hafalan Al-Qur'an secara bil-ghaib
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => calculateTasmiScore(kesalahanMakhraj, kesalahanMad, kesalahanTajwidCount, salahTerhentiCount)}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Kalkulasi Skor Tasmi’
              </button>
            </div>

            {/* Pedoman Baku Pengoreksian Banner */}
            <div className="bg-white/95 border-2 border-emerald-400 rounded-xl p-3.5 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">
                  Pedoman Baku Pengoreksian Tasmi’ Al-Qur'an:
                </span>
                <p className="text-slate-700 leading-relaxed">
                  Pengoreksian tasmi’ alquran <strong>tidak dihitung kesalahan perkata</strong>, melainkan dinilai dan dikoreksi secara objektif sesuai <strong>bacaan tajwid-nya</strong>, <strong>makhorijul huruf-nya</strong>, dan <strong>mad-nya (panjang pendek)</strong>, serta kelancaran (tawaqquf). Klik tombol koreksi cepat di bawah saat menyimak santri.
                </p>
              </div>
            </div>

            {/* 3 Parameter Utama Pengoreksian: Makhorijul Huruf, Ahkamul Mad, dan Bacaan Tajwid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              
              {/* Parameter 1: Makhorijul Huruf */}
              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      <span className="font-extrabold text-xs text-slate-900">1. Makhorijul Huruf</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      -2 poin/koreksi
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Ketepatan tempat keluarnya huruf (Halq, Lisan, Syafatain, Khaisyum, Jauf).
                  </p>

                  {/* Tombol Koreksi Cepat Huruf Makhraj */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wider">
                      Klik Huruf Yang Keliru:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {['ع', 'ح', 'خ', 'ص', 'ض', 'ط', 'ظ', 'ق', 'غ', 'ذ', 'ث', 'ر'].map((huruf) => {
                        const isSelected = tagsKoreksiMakhraj.includes(huruf);
                        return (
                          <button
                            type="button"
                            key={huruf}
                            onClick={() => handleAddMakhrajTag(huruf)}
                            className={`px-2 py-1 rounded text-xs font-serif font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                            }`}
                          >
                            {huruf}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Counter Stepper */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700">Jumlah Koreksi:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(0, kesalahanMakhraj - 1);
                          setKesalahanMakhraj(next);
                          calculateTasmiScore(next, kesalahanMad, kesalahanTajwidCount, salahTerhentiCount);
                        }}
                        className="w-7 h-7 rounded bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 active:scale-95"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-black text-sm text-emerald-800">
                        {kesalahanMakhraj}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = kesalahanMakhraj + 1;
                          setKesalahanMakhraj(next);
                          calculateTasmiScore(next, kesalahanMad, kesalahanTajwidCount, salahTerhentiCount);
                        }}
                        className="w-7 h-7 rounded bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Catatan makhraj (misal: Huruf 'Ain tertukar Hamzah)"
                    value={catatanMakhraj}
                    onChange={(e) => setCatatanMakhraj(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Parameter 2: Ahkamul Mad & Qashr (Mad-nya) */}
              <div className="bg-white p-4 rounded-xl border border-teal-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                      <span className="font-extrabold text-xs text-slate-900">2. Mad &amp; Qashr (Mad-nya)</span>
                    </div>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      -2 poin/koreksi
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Ketepatan panjang pendek harakat (Mad Thabi'i 2 harakat, Jaiz/Wajib 4-5, Lazim 6).
                  </p>

                  {/* Tombol Koreksi Cepat Bacaan Mad */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wider">
                      Klik Kesalahan Mad:
                    </span>
                    <div className="flex flex-col gap-1">
                      {[
                        "Mad Thabi'i < 2 Harakat",
                        "Mad Wajib/Jaiz < 4-5 Harakat",
                        "Mad Berlebih (> 6 Harakat)",
                        "Qashr Dipanjangkan"
                      ].map((item) => {
                        const isSelected = tagsKoreksiMad.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => handleAddMadTag(item)}
                            className={`px-2 py-1 rounded text-[11px] font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-teal-50 hover:border-teal-300'
                            }`}
                          >
                            <span>{item}</span>
                            {isSelected && <Check className="w-3 h-3 text-amber-300" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Counter Stepper */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700">Jumlah Koreksi:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(0, kesalahanMad - 1);
                          setKesalahanMad(next);
                          calculateTasmiScore(kesalahanMakhraj, next, kesalahanTajwidCount, salahTerhentiCount);
                        }}
                        className="w-7 h-7 rounded bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 active:scale-95"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-black text-sm text-teal-800">
                        {kesalahanMad}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = kesalahanMad + 1;
                          setKesalahanMad(next);
                          calculateTasmiScore(kesalahanMakhraj, next, kesalahanTajwidCount, salahTerhentiCount);
                        }}
                        className="w-7 h-7 rounded bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Catatan mad (misal: Mad thabi'i kurang harakat)"
                    value={catatanMad}
                    onChange={(e) => setCatatanMad(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Parameter 3: Kaidah Bacaan Tajwid */}
              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                      <span className="font-extrabold text-xs text-slate-900">3. Bacaan Tajwid</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      -2 poin/koreksi
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Hukum Nun Sakinah/Tanwin, Ghunnah Musyaddadah, Mim Mati, Idgham, Waqaf.
                  </p>

                  {/* Tombol Koreksi Cepat Kaidah Tajwid */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wider">
                      Klik Kesalahan Tajwid:
                    </span>
                    <div className="flex flex-col gap-1">
                      {[
                        "Ghunnah Kurang 2 Harakat",
                        "Ikhfa Tertukar Idzhar",
                        "Idgham Bighunnah Terlewat",
                        "Iqlab Belum Sempurna",
                        "Qalqalah Kurang Membal",
                        "Waqaf Terpotong / Qabih"
                      ].map((item) => {
                        const isSelected = tagsKoreksiTajwid.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => handleAddTajwidTag(item)}
                            className={`px-2 py-1 rounded text-[11px] font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-700 text-white border-amber-800 shadow-xs'
                                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                            }`}
                          >
                            <span>{item}</span>
                            {isSelected && <Check className="w-3 h-3 text-amber-300" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Counter Stepper */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700">Jumlah Koreksi:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(0, kesalahanTajwidCount - 1);
                          setKesalahanTajwidCount(next);
                          calculateTasmiScore(kesalahanMakhraj, kesalahanMad, next, salahTerhentiCount);
                        }}
                        className="w-7 h-7 rounded bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 active:scale-95"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-black text-sm text-amber-800">
                        {kesalahanTajwidCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = kesalahanTajwidCount + 1;
                          setKesalahanTajwidCount(next);
                          calculateTasmiScore(kesalahanMakhraj, kesalahanMad, next, salahTerhentiCount);
                        }}
                        className="w-7 h-7 rounded bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Catatan tajwid (misal: Ghunnah kurang dengung)"
                    value={catatanTajwid}
                    onChange={(e) => setCatatanTajwid(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Live Calculation Formula Breakdown */}
            <div className="bg-gradient-to-r from-emerald-950 to-teal-950 text-white p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs border border-emerald-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-emerald-300 font-bold">Rumus Skor Tasmi’ (Bukan Perkata):</span>
                  <span className="font-mono bg-emerald-900/90 border border-emerald-700 px-2 py-0.5 rounded text-amber-200 font-semibold">
                    100 - ({kesalahanMakhraj}×2 Makhraj) - ({kesalahanMad}×2 Mad) - ({kesalahanTajwidCount}×2 Tajwid) - ({salahTerhentiCount}×1 Tawaqquf)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Total koreksi kesalahan: <strong>{kesalahanMakhraj + kesalahanMad + kesalahanTajwidCount}</strong> poin catatan tajwid/makhraj/mad
                </p>
              </div>

              <div className="flex items-center gap-3 bg-emerald-900/60 p-2 rounded-lg border border-emerald-700/60 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-emerald-300 block">Skor Rekomendasi:</span>
                  <span className="text-lg font-black text-amber-300">
                    {Math.max(40, Math.min(100, 100 - (kesalahanMakhraj * 2) - (kesalahanMad * 2) - (kesalahanTajwidCount * 2) - (salahTerhentiCount * 1)))}
                  </span>
                </div>
                <div className="h-7 w-px bg-emerald-700"></div>
                <span className="text-xs font-extrabold px-2 py-1 rounded bg-amber-400 text-slate-950">
                  {calculatePredikat(Math.max(40, Math.min(100, 100 - (kesalahanMakhraj * 2) - (kesalahanMad * 2) - (kesalahanTajwidCount * 2) - (salahTerhentiCount * 1))))}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4B: Fitur Checklist Penguasaan Aspek Tajwid Santri */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-amber-950 flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-amber-700" /> Checklist Aspek Penguasaan Tajwid
              </h3>
              <span className="text-xs text-amber-800">Centang aspek tajwid yang dikuasai</span>
            </div>

            {/* Checklist Aspek Tajwid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {[
                { 
                  key: 'makhraj' as keyof AspekTajwid, 
                  title: 'Makharijul Huruf', 
                  desc: 'Ketepatan keluarnya huruf (Halq, Lisan, Syafatain)' 
                },
                { 
                  key: 'mad' as keyof AspekTajwid, 
                  title: 'Ahkamul Mad & Qashr', 
                  desc: 'Panjang pendek harakat (Mad Thabi\'i, Wajib, Jaiz)' 
                },
                { 
                  key: 'shifat' as keyof AspekTajwid, 
                  title: 'Shifatul Huruf', 
                  desc: 'Qalqalah, Hams, Isti\'la, Tafkhim & Tarqiq' 
                },
                { 
                  key: 'nunTanwin' as keyof AspekTajwid, 
                  title: 'Nun Sakinah & Tanwin', 
                  desc: 'Idzhar, Idgham, Ikhfa, dan Iqlab' 
                },
                { 
                  key: 'gunnah' as keyof AspekTajwid, 
                  title: 'Ghunnah & Mim Mati', 
                  desc: 'Ghunnah musyaddadah 2 harakat & Ikhfa syafawi' 
                },
                { 
                  key: 'waqaf' as keyof AspekTajwid, 
                  title: 'Waqaf & Ibtida\'', 
                  desc: 'Tempat berhenti & memulai bacaan yang tepat' 
                },
              ].map((aspect) => {
                const checked = aspekTajwid[aspect.key];
                return (
                  <div
                    key={aspect.key}
                    onClick={() => toggleAspekTajwid(aspect.key)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                      checked
                        ? 'bg-amber-100/70 border-amber-300 text-amber-950 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                      checked 
                        ? 'bg-amber-600 border-amber-700 text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <p className="font-semibold text-xs leading-tight">{aspect.title}</p>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{aspect.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Catatan Tajwid Spesifik */}
            <div>
              <label className="block text-xs font-semibold text-amber-950 mb-1">
                Catatan Tajwid Spesifik Santri
              </label>
              <input
                type="text"
                placeholder="Contoh: Perbaiki makhraj huruf 'Ain dan Ha', tebalkan bunyi Ra' berharakat fathah"
                value={catatanTajwid}
                onChange={(e) => setCatatanTajwid(e.target.value)}
                className="w-full bg-white border border-amber-300/80 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 5: Kolom Nilai, Predikat, & Status */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-emerald-700" /> Kolom Nilai &amp; Hasil Evaluasi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Nilai Angka */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nilai Angka (0 - 100) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={nilaiAngka}
                    onChange={(e) => setNilaiAngka(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-24 bg-white border border-slate-300 rounded-lg px-3 py-2 text-lg font-bold text-center text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-500">Predikat:</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 w-fit">
                      {currentPredikat}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Kelulusan Setoran */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Status Kelulusan Setoran <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1.5">
                  {(['Lulus', 'Lanjut', 'Ulang (I\'adah)'] as StatusSetoran[]).map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setStatus(st)}
                      className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border text-center flex-1 transition-all ${
                        status === st
                          ? st === "Ulang (I'adah)"
                            ? 'bg-rose-700 text-white border-rose-800'
                            : 'bg-emerald-700 text-white border-emerald-800'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pembimbing */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ustadz / Ustadzah Pengampu
                </label>
                <input
                  type="text"
                  value={pembimbing}
                  onChange={(e) => setPembimbing(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Nama Pembimbing Setoran"
                  required
                />
              </div>
            </div>

            {/* Catatan Ustadz */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Pesan / Nasehat Ustadz untuk Santri
              </label>
              <textarea
                rows={2}
                value={catatanUstadz}
                onChange={(e) => setCatatanUstadz(e.target.value)}
                placeholder="Contoh: Alhamdulillah hafalan sangat mutqin. Pertahankan muraja'ah sebelum tidur."
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 rounded-lg shadow-sm transition-all"
            >
              Simpan Laporan Setoran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
