<<<<<<< HEAD
# Nabung Bareng - Aplikasi Nabung Bersama

Aplikasi web untuk mencatat dan melacak tabungan bersama antara Kasya dan Casa dengan fitur sinkronisasi real-time menggunakan Firebase.

## Fitur Utama

- ✅ **Sinkronisasi Real-time**: Data tersimpan di Firebase Firestore dan tersedia di semua perangkat
- ✅ **Format Angka Otomatis**: Input jumlah dengan format Rupiah (titik sebagai pemisah ribuan)
- ✅ **Pilihan Aksi**: Tambah nabung atau bayar nabung
- ✅ **Modal QRIS Payment**: Simulasi pembayaran QRIS untuk fitur bayar nabung
- ✅ **Riwayat Lengkap**: Menampilkan semua transaksi dengan jenis aksi
- ✅ **Responsive Design**: Tampil optimal di desktop dan mobile
- ✅ **Notifikasi**: Feedback real-time untuk setiap aksi

## Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: Firebase Firestore
- **Hosting**: Netlify (rekomendasi)
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)

## Setup dan Instalasi

### 1. Persiapan Firebase

1. Buat akun di [Firebase Console](https://console.firebase.google.com/)
2. Buat project baru
3. Aktifkan Firestore Database
4. Buat web app dan salin konfigurasi

### 2. Konfigurasi Firebase

Edit file `firebase-config.js` dan ganti placeholder dengan konfigurasi Firebase Anda:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Hosting di Netlify

1. Upload semua file ke repository GitHub
2. Daftar akun di [Netlify](https://netlify.com)
3. Connect repository GitHub
4. Deploy otomatis

## Cara Penggunaan

1. **Tambah Nabung**:
   - Pilih orang (Kasya/Casa)
   - Masukkan jumlah (format otomatis)
   - Pilih tanggal
   - Pilih aksi "Tambah Nabung"
   - Klik "Proses"

2. **Bayar Nabung**:
   - Pilih orang (Kasya/Casa)
   - Masukkan jumlah yang akan dibayar
   - Pilih tanggal
   - Pilih aksi "Bayar Nabung"
   - Klik "Proses" → akan muncul modal QRIS
   - Konfirmasi pembayaran

3. **Melihat Riwayat**:
   - Scroll ke bagian "Riwayat Nabung"
   - Semua transaksi tersimpan dan terurut berdasarkan tanggal terbaru

## Sinkronisasi Data

Data tersimpan di Firebase Firestore sehingga:
- ✅ Data tersedia di semua perangkat (HP Anda dan HP pacar)
- ✅ Update real-time tanpa perlu refresh halaman
- ✅ Aman dan terproteksi
- ✅ Backup otomatis

## File Structure

```
nabung-bareng/
├── index.html          # Halaman utama
├── styles.css          # Styling aplikasi
├── script.js           # Logika aplikasi
├── firebase-config.js  # Konfigurasi Firebase
└── README.md          # Dokumentasi ini
```

## Troubleshooting

### Data tidak muncul
- Pastikan koneksi internet stabil
- Periksa konfigurasi Firebase sudah benar
- Buka Developer Tools (F12) untuk melihat error

### Format angka tidak berfungsi
- Pastikan JavaScript aktif di browser
- Coba refresh halaman

### Firebase error
- Pastikan project Firebase aktif
- Periksa Firestore rules (default allow read/write untuk development)

## Pengembangan Lanjutan

Beberapa ide fitur tambahan:
- [ ] Authentication (login untuk keamanan)
- [ ] Export data ke Excel/PDF
- [ ] Notifikasi push untuk reminder nabung
- [ ] Chart/statistik progress nabung
- [ ] Kategori nabung (darurat, liburan, dll)
- [ ] Backup data otomatis

## Lisensi

Project ini dibuat untuk keperluan pribadi. Silakan modify sesuai kebutuhan.

---

**Happy Saving! 💰✨**
=======
# nabung-bareng
Web yang terbuat hanya dari, html, css, dan js, web ini untuk memudahkan user untuk menabung bersama tetapi hanya untuk 2 orang saja menabung ini
>>>>>>> 29b7fc02e528dcde56fec98bacc9b9905c1070d6
