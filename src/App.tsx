import React, { useState, useEffect, useMemo } from 'react';
import { HeaderNavbar } from './components/HeaderNavbar';
import { StatSummary } from './components/StatSummary';
import { LaporanTable } from './components/LaporanTable';
import { SantriCards } from './components/SantriCards';
import { SetoranFormModal } from './components/SetoranFormModal';
import { SantriFormModal } from './components/SantriFormModal';
import { DetailSetoranModal } from './components/DetailSetoranModal';
import { PrintReportModal } from './components/PrintReportModal';
import { SantriProgressChart } from './components/SantriProgressChart';
import { SertifikatTahfidzTab } from './components/SertifikatTahfidzTab';
import { CertificateViewModal } from './components/CertificateViewModal';
import { CertificateFormModal } from './components/CertificateFormModal';
import { Santri, SetoranRecord, SertifikatTahfidz, CapaianJuz } from './types';
import { INITIAL_SANTRI, INITIAL_SETORAN, INITIAL_CERTIFICATES } from './data/initialData';
import { formatTanggalIndo } from './data/quranData';

export default function App() {
  // Local storage persistence
  const [santriList, setSantriList] = useState<Santri[]>(() => {
    try {
      const saved = localStorage.getItem('tahsin_tahfiz_santri');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading santri:', e);
    }
    return INITIAL_SANTRI;
  });

  const [records, setRecords] = useState<SetoranRecord[]>(() => {
    try {
      const saved = localStorage.getItem('tahsin_tahfiz_records');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading records:', e);
    }
    return INITIAL_SETORAN;
  });

  const [certificates, setCertificates] = useState<SertifikatTahfidz[]>(() => {
    try {
      const saved = localStorage.getItem('tahsin_tahfiz_certificates');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading certificates:', e);
    }
    return INITIAL_CERTIFICATES;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('tahsin_tahfiz_santri', JSON.stringify(santriList));
  }, [santriList]);

  useEffect(() => {
    localStorage.setItem('tahsin_tahfiz_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('tahsin_tahfiz_certificates', JSON.stringify(certificates));
  }, [certificates]);

  // Tab & Filter states
  const [activeTab, setActiveTab] = useState<'laporan' | 'santri' | 'rekap' | 'sertifikat'>('laporan');
  const [selectedHalaqah, setSelectedHalaqah] = useState<string>('ALL');

  // Modals state
  const [isSetoranModalOpen, setIsSetoranModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SetoranRecord | null>(null);

  const [isSantriModalOpen, setIsSantriModalOpen] = useState(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);

  const [viewingRecord, setViewingRecord] = useState<SetoranRecord | null>(null);
  
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedSantriForPrint, setSelectedSantriForPrint] = useState<Santri | null>(null);
  const [chartSantriId, setChartSantriId] = useState<string>(santriList[0]?.id || 's1');

  // Certificate Modals state
  const [isCertificateViewOpen, setIsCertificateViewOpen] = useState(false);
  const [viewingCertificate, setViewingCertificate] = useState<SertifikatTahfidz | null>(null);

  const [isCertificateFormOpen, setIsCertificateFormOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<SertifikatTahfidz | null>(null);
  const [certSantriId, setCertSantriId] = useState<string | undefined>(undefined);
  const [certJuz, setCertJuz] = useState<CapaianJuz | undefined>(30);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Distinct halaqah list
  const halaqahList = useMemo(() => {
    const set = new Set<string>();
    santriList.forEach((s) => {
      if (s.halaqah) set.add(s.halaqah);
    });
    return Array.from(set);
  }, [santriList]);

  // Handler: Save Setoran
  const handleSaveSetoran = (savedRec: SetoranRecord) => {
    setRecords((prev) => {
      const exists = prev.findIndex((r) => r.id === savedRec.id);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = savedRec;
        return updated;
      }
      return [savedRec, ...prev];
    });
    showToast(`Setoran ${savedRec.santriNama} (Surah ${savedRec.surah}) berhasil disimpan!`);
  };

  // Handler: Delete Setoran
  const handleDeleteSetoran = (id: string) => {
    const rec = records.find((r) => r.id === id);
    if (!rec) return;
    if (confirm(`Yakin ingin menghapus rekaman setoran ${rec.santriNama} (Surah ${rec.surah})?`)) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      showToast('Rekaman setoran berhasil dihapus.');
    }
  };

  // Handler: Save Santri
  const handleSaveSantri = (savedSantri: Santri) => {
    setSantriList((prev) => {
      const idx = prev.findIndex((s) => s.id === savedSantri.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = savedSantri;
        return updated;
      }
      return [...prev, savedSantri];
    });
    showToast(`Data santri ${savedSantri.nama} berhasil disimpan.`);
  };

  // Handler: Delete Santri
  const handleDeleteSantri = (id: string) => {
    const santri = santriList.find((s) => s.id === id);
    if (!santri) return;
    if (confirm(`Hapus santri ${santri.nama}? Semua riwayat setoran tetap tersimpan.`)) {
      setSantriList((prev) => prev.filter((s) => s.id !== id));
      showToast(`Santri ${santri.nama} dihapus.`);
    }
  };

  // Handler: Save Certificate
  const handleSaveCertificate = (cert: SertifikatTahfidz) => {
    setCertificates((prev) => {
      const idx = prev.findIndex((c) => c.id === cert.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = cert;
        return updated;
      }
      return [cert, ...prev];
    });

    // Mark the santri's completed juz in santriList if not already present
    setSantriList((prev) => 
      prev.map((s) => {
        if (s.id === cert.santriId) {
          const currentJuz = s.juzLulus || [];
          if (!currentJuz.includes(cert.juzUtama)) {
            return {
              ...s,
              juzLulus: [...currentJuz, cert.juzUtama]
            };
          }
        }
        return s;
      })
    );

    showToast(`Syahadah Tahfidz ${cert.namaJuz} untuk ${cert.santriNama} berhasil diterbitkan!`);
  };

  // Handler: Delete Certificate
  const handleDeleteCertificate = (certId: string) => {
    const cert = certificates.find((c) => c.id === certId);
    if (!cert) return;
    if (confirm(`Hapus sertifikat ${cert.namaJuz} untuk santri ${cert.santriNama}?`)) {
      setCertificates((prev) => prev.filter((c) => c.id !== certId));
      showToast('Sertifikat berhasil dihapus dari arsip.');
    }
  };

  // Handler: Toggle Juz Status for a Santri
  const handleToggleJuzStatus = (santriId: string, juz: CapaianJuz) => {
    setSantriList((prev) =>
      prev.map((s) => {
        if (s.id === santriId) {
          const current = s.juzLulus || [];
          const exists = current.includes(juz);
          const next = exists ? current.filter((j) => j !== juz) : [...current, juz];
          return { ...s, juzLulus: next };
        }
        return s;
      })
    );
    showToast(`Status kelulusan Juz ${juz} diperbarui.`);
  };

  // Certificate Open Handlers
  const handleOpenCreateCertificate = (santriId?: string, juz?: CapaianJuz) => {
    setEditingCertificate(null);
    setCertSantriId(santriId || santriList[0]?.id);
    setCertJuz(juz || 30);
    setIsCertificateFormOpen(true);
  };

  const handleOpenEditCertificate = (cert: SertifikatTahfidz) => {
    setEditingCertificate(cert);
    setCertSantriId(cert.santriId);
    setCertJuz(cert.juzUtama);
    setIsCertificateFormOpen(true);
  };

  const handleViewCertificate = (cert: SertifikatTahfidz) => {
    setViewingCertificate(cert);
    setIsCertificateViewOpen(true);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (records.length === 0) {
      alert('Belum ada data setoran untuk diekspor.');
      return;
    }

    const headers = [
      'No',
      'Hari',
      'Tanggal',
      'Nama Santri',
      'Kelas',
      'Jenis Setoran',
      'Juz',
      'Surah',
      'Ayat Mulai',
      'Ayat Selesai',
      'Kelancaran',
      'Jumlah Salah / Tawaqquf',
      'Catatan Kelancaran',
      'Catatan Tajwid',
      'Nilai Angka',
      'Predikat',
      'Status Setoran',
      'Pembimbing'
    ];

    const rows = records.map((r, index) => [
      index + 1,
      r.hari,
      r.tanggal,
      `"${r.santriNama.replace(/"/g, '""')}"`,
      r.santriKelas,
      r.jenis,
      r.juz,
      `"${r.surah}"`,
      r.ayatMulai,
      r.ayatSelesai,
      r.kelancaran,
      r.salahTerhentiCount,
      `"${(r.catatanKelancaran || '').replace(/"/g, '""')}"`,
      `"${(r.catatanTajwid || '').replace(/"/g, '""')}"`,
      r.nilaiAngka,
      r.predikat,
      r.status,
      `"${(r.pembimbing || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Tahsin_Tahfiz_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('File CSV Laporan Tahsin Tahfiz berhasil diunduh.');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-emerald-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <HeaderNavbar
        onOpenSetoranModal={() => {
          setEditingRecord(null);
          setIsSetoranModalOpen(true);
        }}
        onOpenSantriModal={() => {
          setEditingSantri(null);
          setIsSantriModalOpen(true);
        }}
        onOpenPrintModal={() => {
          setSelectedSantriForPrint(null);
          setIsPrintModalOpen(true);
        }}
        onExportData={handleExportCSV}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedHalaqah={selectedHalaqah}
        setSelectedHalaqah={setSelectedHalaqah}
        halaqahList={halaqahList}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Metric Summary Bar */}
        <StatSummary records={records} totalSantri={santriList.length} />

        {/* Content based on Active Tab */}
        {activeTab === 'laporan' ? (
          <LaporanTable
            records={records}
            selectedHalaqah={selectedHalaqah}
            onAddNew={() => {
              setEditingRecord(null);
              setIsSetoranModalOpen(true);
            }}
            onViewDetail={(record) => setViewingRecord(record)}
            onEdit={(record) => {
              setEditingRecord(record);
              setIsSetoranModalOpen(true);
            }}
            onDelete={handleDeleteSetoran}
          />
        ) : activeTab === 'santri' ? (
          <SantriCards
            santriList={santriList}
            records={records}
            certificates={certificates}
            onOpenNewSetoranForSantri={(santri) => {
              setEditingRecord({
                id: `rec-${Date.now()}`,
                santriId: santri.id,
                santriNama: santri.nama,
                santriKelas: santri.kelas,
                hari: 'Senin',
                tanggal: new Date().toISOString().split('T')[0],
                waktu: '07:30',
                jenis: 'Tahfiz Ziyadah',
                juz: 30,
                surah: "An-Naba'",
                ayatMulai: 1,
                ayatSelesai: 10,
                kelancaran: 'Sangat Lancar',
                salahTerhentiCount: 0,
                catatanKelancaran: '',
                aspekTajwid: {
                  makhraj: true,
                  mad: true,
                  shifat: true,
                  nunTanwin: true,
                  gunnah: true,
                  waqaf: true
                },
                catatanTajwid: '',
                nilaiAngka: 95,
                predikat: 'Mumtaz',
                status: 'Lulus',
                pembimbing: santri.pembimbing,
                createdAt: new Date().toISOString()
              });
              setIsSetoranModalOpen(true);
            }}
            onEditSantri={(santri) => {
              setEditingSantri(santri);
              setIsSantriModalOpen(true);
            }}
            onDeleteSantri={handleDeleteSantri}
            onPrintSantriReport={(santri) => {
              setSelectedSantriForPrint(santri);
              setIsPrintModalOpen(true);
            }}
            onViewRecordDetail={(record) => setViewingRecord(record)}
            onOpenCreateCertificate={handleOpenCreateCertificate}
            onViewCertificate={handleViewCertificate}
          />
        ) : activeTab === 'rekap' ? (
          /* Tab: Grafik Nilai Santri */
          <div className="space-y-6">
            {/* Dedicated Progress Chart Card */}
            {(() => {
              const targetSantri = santriList.find(s => s.id === chartSantriId) || santriList[0];
              if (!targetSantri) return null;
              return (
                <SantriProgressChart
                  santri={targetSantri}
                  records={records}
                  santriList={santriList}
                  onSelectSantri={(s) => setChartSantriId(s.id)}
                  showSantriSelector={true}
                />
              );
            })()}

            {/* Quick Santri Performance Overview Cards */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
              <h4 className="text-sm font-bold text-slate-800 mb-3">
                Pilih Santri Untuk Melihat Riwayat Progres:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {santriList.map((s) => {
                  const sRecs = records.filter(r => r.santriId === s.id);
                  const isSelected = s.id === chartSantriId;
                  const avg = sRecs.length > 0 
                    ? Math.round((sRecs.reduce((acc, c) => acc + c.nilaiAngka, 0) / sRecs.length) * 10) / 10
                    : null;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setChartSantriId(s.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30' 
                          : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {s.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            {s.nama}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {s.kelas} • {sRecs.length} Setoran
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-800 block">
                          {avg !== null ? avg : '-'}
                        </span>
                        <span className="text-[10px] text-slate-400">Rata-rata</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Tab: Sertifikat Tahfidz (Juz 26-30) */
          <SertifikatTahfidzTab
            santriList={santriList}
            certificates={certificates}
            records={records}
            onOpenCreateCertificate={handleOpenCreateCertificate}
            onOpenEditCertificate={handleOpenEditCertificate}
            onViewCertificate={handleViewCertificate}
            onDeleteCertificate={handleDeleteCertificate}
            onToggleJuzStatus={handleToggleJuzStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          <p className="font-medium text-slate-700">
            Aplikasi Laporan Mutaba'ah Tahsin, Tahfiz, &amp; Syahadah Ujian Rasmi’ Al-Qur'an
          </p>
          <p className="mt-0.5 text-slate-400">
            SMP Islam Al Azhar 9 • Penilaian Berdasarkan Makhorijul Huruf, Mad &amp; Qashr, dan Kaidah Tajwid (Bukan Perkata)
          </p>
        </div>
      </footer>

      {/* Modals */}
      <SetoranFormModal
        isOpen={isSetoranModalOpen}
        onClose={() => {
          setIsSetoranModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveSetoran}
        santriList={santriList}
        initialData={editingRecord}
      />

      <SantriFormModal
        isOpen={isSantriModalOpen}
        onClose={() => {
          setIsSantriModalOpen(false);
          setEditingSantri(null);
        }}
        onSave={handleSaveSantri}
        initialData={editingSantri}
      />

      <DetailSetoranModal
        record={viewingRecord}
        onClose={() => setViewingRecord(null)}
        onPrintSingle={(rec) => {
          const matchedSantri = santriList.find(s => s.id === rec.santriId);
          setSelectedSantriForPrint(matchedSantri || null);
          setIsPrintModalOpen(true);
        }}
      />

      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        santriList={santriList}
        records={records}
        selectedSantriForPrint={selectedSantriForPrint}
      />

      <CertificateViewModal
        certificate={viewingCertificate}
        isOpen={isCertificateViewOpen}
        onClose={() => {
          setIsCertificateViewOpen(false);
          setViewingCertificate(null);
        }}
      />

      <CertificateFormModal
        isOpen={isCertificateFormOpen}
        onClose={() => {
          setIsCertificateFormOpen(false);
          setEditingCertificate(null);
        }}
        onSave={handleSaveCertificate}
        santriList={santriList}
        initialData={editingCertificate}
        defaultSantriId={certSantriId}
        defaultJuz={certJuz}
      />
    </div>
  );
}
