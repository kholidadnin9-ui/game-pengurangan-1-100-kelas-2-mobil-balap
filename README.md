# Race Math

Game balap mobil berbahasa Indonesia untuk belajar pengurangan 1-100, dirancang untuk siswa kelas 2 SD. Antarmuka menggunakan garasi mobil sport dengan aksen biru neon dan hijau.

created by: Widodo guru sd

## Cara Bermain

1. Pilih mobil yang sudah terbuka di garasi.
2. Pilih level, lalu tekan **Mulai Balap**.
3. Selesaikan 10 soal dengan memilih satu dari tiga opsi jawaban. Tidak ada batas waktu untuk menghitung.
4. Baca umpan balik, lalu pilih **Soal Selanjutnya**.
5. Dapatkan minimal 6 jawaban benar untuk membuka level berikutnya. Hasil dan pembahasan seluruh soal tersedia setelah balapan.

Jawaban benar membuat mobil siswa memimpin. Setiap jawaban salah membuat mobil lawan melaju lebih cepat, dengan efek nitro jingga, dan berada di depan mobil siswa. Posisi tetap bertahan saat berpindah soal; jawaban benar berikutnya memungkinkan siswa menyalip kembali. Kedua mobil selalu bergerak maju, dan aturan ini tetap berlaku pada soal terakhir. Kelulusan level dan hadiah tetap berdasarkan jumlah jawaban benar, bukan posisi finis.

## Materi

| Level | Lintasan | Bilangan yang dikurangi | Jumlah Soal |
| --- | --- | --- | --- |
| 1 | Pemanasan | 1-20 | 10 |
| 2 | Tambah Kecepatan | 21-40 | 10 |
| 3 | Tikungan Seru | 41-60 | 10 |
| 4 | Lintasan Kilat | 61-80 | 10 |
| 5 | Grand Finale | 81-100 | 10 |

Semua bilangan, hasil, dan pilihan jawaban berada pada rentang 1-100. Setiap soal selalu memiliki tiga pilihan berbeda dan tepat satu jawaban benar. Urutan soal dan opsi diacak setiap kali balapan dimulai.

## Hadiah dan Progres

- 6-7 benar: 1 bintang; 8 benar: 2 bintang; 9-10 benar: 3 bintang.
- Setiap kenaikan satu jawaban pada rekor terbaik memberikan 10 koin.
- Kelulusan pertama suatu level memberikan bonus 50 koin.
- Setiap bintang baru memberikan 5 berlian.
- Level 1-4 masing-masing membuka satu mobil baru saat pertama kali lulus.
- Mengulang level tidak menggandakan hadiah yang sudah diperoleh.
- Rekor, mobil, hadiah, dan pengaturan disimpan di `localStorage` pada browser dan perangkat yang sama. Balapan yang belum diselesaikan tidak disimpan.
- Seluruh progres dapat dihapus lewat Pengaturan dengan konfirmasi terlebih dahulu.

## Kontrol

- Klik atau sentuh salah satu jawaban.
- Tombol `1`, `2`, dan `3` memilih jawaban.
- `Enter` memulai balapan atau melanjutkan setelah menjawab.
- `Escape` membuka konfirmasi keluar dari balapan atau menutup dialog.
- Efek suara dan animasi minimal dapat diatur melalui Pengaturan.

## Struktur

- `src/App.tsx`: alur aplikasi, sesi balapan, dialog, dan penyimpanan progres.
- `src/game.ts`: bank soal, pengacakan opsi, penilaian, hadiah, dan efek suara.
- `src/components/`: garasi, pilihan level, lintasan, hasil, dan komponen bersama.
- `src/styles/`: gaya visual serta tata letak desktop dan seluler.
- `public/images/`: lima gambar mobil yang tersedia secara lokal.

Aplikasi menggunakan React, TypeScript, Vite, Tailwind CSS v4, dan Lucide. Font dimuat melalui Google Fonts; font sistem menjadi cadangan jika koneksi tidak tersedia. Tidak diperlukan akun maupun backend.