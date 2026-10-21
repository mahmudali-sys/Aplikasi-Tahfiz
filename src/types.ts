export type JenisSetoran = 
  | 'Tahsin' 
  | 'Tahfiz Ziyadah' 
  | 'Tahfiz Muroja\'ah'
  | 'Tasmi’ Al-Qur\'an';

export type TingkatKelancaran = 
  | 'Sangat Lancar' 
  | 'Lancar' 
  | 'Cukup Lancar' 
  | 'Kurang Lancar';

export type PredikatNilai = 
  | 'Mumtaz' 
  | 'Jayyid Jiddan' 
  | 'Jayyid' 
  | 'Maqbul' 
  | 'I\'adah';

export type StatusSetoran = 'Lulus' | 'Lanjut' | 'Ulang (I\'adah)';

export interface AspekTajwid {
  makhraj: boolean;      // Makharijul Huruf
  mad: boolean;          // Ahkamul Mad wal Qashr (Panjang Pendek)
  shifat: boolean;       // Shifatul Huruf (Qalqalah, Hams, dsb)
  nunTanwin: boolean;    // Hukum Nun Mati & Tanwin
  gunnah: boolean;       // Ghunnah Musyaddadah & Mim Mati
  waqaf: boolean;        // Waqaf & Ibtida' (Tanda Berhenti/Mulai)
}

export type CapaianJuz = 30 | 29 | 28 | 27 | 26;

export interface Santri {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  halaqah: string;
  jenisKelamin: 'L' | 'P';
  pembimbing: string;
  targetJuz?: number;
  juzLulus?: CapaianJuz[]; // Daftar juz yang telah diselesaikan (30, 29, 28, 27, 26)
}

export interface SetoranRecord {
  id: string;
  santriId: string;
  santriNama: string;
  santriKelas: string;
  hari: string;           // e.g. "Senin"
  tanggal: string;        // e.g. "2026-09-09"
  waktu?: string;         // e.g. "07:30" (Ba'da Subuh, Pagi, Ba'da Ashar, dll)
  jenis: JenisSetoran;
  juz: number;
  surah: string;
  ayatMulai: number;
  ayatSelesai: number;
  halaman?: number;
  
  // Kelancaran
  kelancaran: TingkatKelancaran;
  salahTerhentiCount: number; // Berapa kali tawaqquf/diingatkan
  catatanKelancaran: string;

  // Tajwid
  aspekTajwid: AspekTajwid;
  catatanTajwid: string;

  // Pengoreksian Tasmi' Al-Qur'an (Bukan Perkata, melainkan Makhorijul Huruf, Mad, & Bacaan Tajwid)
  kesalahanMakhraj?: number;     // Jumlah koreksi Makhorijul Huruf
  catatanMakhraj?: string;       // Rincian koreksi makhraj
  kesalahanMad?: number;         // Jumlah koreksi Ahkamul Mad & Qashr (Panjang-Pendek)
  catatanMad?: string;           // Rincian koreksi mad
  kesalahanTajwidCount?: number; // Jumlah koreksi Kaidah Tajwid (Ghunnah, Nun Mati, Waqaf, dsb)
  tagsKoreksiMakhraj?: string[]; // Tag huruf makhraj yang dikoreksi (misal ['ع', 'ح', 'ص'])
  tagsKoreksiMad?: string[];     // Tag mad yang dikoreksi (misal ['Mad Thabi\'i < 2 Harakat'])
  tagsKoreksiTajwid?: string[];  // Tag tajwid yang dikoreksi (misal ['Ghunnah Kurang Dengung'])
  isTasmiMode?: boolean;
  isRasmiMode?: boolean;

  // Nilai
  nilaiAngka: number;         // 0 - 100
  predikat: PredikatNilai;
  status: StatusSetoran;

  pembimbing: string;
  catatanUstadz?: string;
  createdAt: string;
}

export interface SurahInfo {
  number: number;
  name: string;
  arabicName: string;
  totalAyat: number;
  juzStart: number;
}

export interface SertifikatTahfidz {
  id: string;
  nomorSertifikat: string;
  santriId: string;
  santriNama: string;
  santriNis: string;
  santriKelas: string;
  santriHalaqah: string;
  juzSelesai: CapaianJuz[]; // e.g. [30] or [30, 29]
  juzUtama: CapaianJuz;      // 30, 29, 28, 27, 26
  namaJuz: string;          // e.g. "Juz 30 (Juz 'Amma)"
  nilaiAkhir: number;       // e.g. 95
  predikat: PredikatNilai;   // Mumtaz, Jayyid Jiddan, etc.
  nilaiMakhraj: number;     // e.g. 96
  nilaiMad: number;         // e.g. 94
  nilaiTajwid: number;      // e.g. 95
  nilaiKelancaran: number;  // e.g. 95
  tanggalMasehi: string;    // e.g. "20 Oktober 2026"
  tanggalHijriyah?: string; // e.g. "9 Rabi'ul Akhir 1448 H"
  kota: string;             // e.g. "Bekasi"
  namaLembaga: string;      // e.g. "SMP Islam Al Azhar 9"
  namaKepalaSekolah: string;
  namaPenguji: string;
  catatanDoa?: string;
  createdAt: string;
}

