# Ornamen

## Ornamen 1

- Nama ornamen: Floating blocks
- Digunakan pada: Hero (Batch 2), OUR MESSAGE (Batch 3), WHY US (Batch 4), MISSION (Batch 5), JOBS (Batch 6), INTERVIEW (Batch 7), CULTURE (Batch 8), SELECTION (Batch 9), dan FAQ (Batch 10). JOIN OUR TEAM dan FOOTER tidak memiliki ornamen pada referensi.
- Cara pembuatan: Bentuk dan loop menggunakan CSS; parallax scroll memakai vanilla JavaScript untuk state dan CSS untuk styling (tambahan disetujui 10 Oktober 2026).
- Penyedia ornamen: AI agent membuat bentuk dan animasi CSS; pengguna tidak perlu menyediakan aset tambahan.
- File aset: Tidak diperlukan. Style berada di website/css/style.css; elemen dekoratif berada di website/index.html; state parallax berada di website/js/main.js.
- Aksesibilitas: aria-hidden="true", pointer-events: none, dan tidak masuk urutan fokus keyboard.

### Penempatan

- Acuan posisi: Komposisi foto Hero pada references/sections/header - hero.jpg. Posisi dan ukuran menggunakan persentase relatif terhadap hero__media, sehingga mengikuti ukuran layout.
- Posisi desktop: Empat blok; biru besar di kanan atas, cyan di kiri foto utama, biru memanjang di bawah foto utama, serta cyan di bagian depan bawah komposisi foto.
- Posisi mobile: Tetap empat blok dengan ukuran dan posisi yang disesuaikan terhadap komposisi foto mobile; tidak menutupi teks atau CTA.
- Layer: Tiga blok belakang berada di z-index 0, foto utama di 1, foto kedua di 2, dan blok cyan depan di 3 dalam stacking context hero__media. Header dan konten memiliki layer terpisah. Hero memakai overflow: clip untuk mencegah dekorasi membuat scroll horizontal.
- Warna implementasi: Biru #8DDCFA dan cyan #91EAF7, opacity 0.35–0.5 sesuai layer. Nilai ini mengikuti referensi visual; seluruh poin ornamen sudah diperiksa dan disetujui pengguna pada 11 Oktober 2026.

### Animasi

- Menggunakan animasi: Ya.
- Keputusan pengguna (9 Oktober 2026): Loop naik-turun pelan seperti mengambang; setiap ornamen memiliki pergerakan dengan kedalaman berbeda.
- Gerakan: translateY dengan ease-in-out; bentuk, foto, dan teks tidak berubah ukuran atau posisi layout.
- Trigger: Loop mengambang otomatis ketika ornamen dirender; tambahan parallax mengikuti posisi section saat halaman di-scroll.
- Berulang atau sekali: Loop mengambang infinite; parallax merespons scroll dua arah secara berkelanjutan, bukan animasi masuk sekali.
- Berhenti saat: prefers-reduced-motion: reduce; ornamen ditampilkan statis pada posisi referensi.
- Bergerak sendiri atau bersama kelompok: Masing-masing bergerak sendiri, dengan jarak, durasi, dan fase berbeda.
- Parameter awal yang dipilih agent: Blok jauh ±8px / 14 detik / delay -3 detik; blok tengah ±14px / 12 detik / delay -7 detik; blok bawah ±18px / 10 detik / delay -4 detik; blok dekat ±24px / 8 detik / delay -1 detik. Jarak adalah simpangan dari posisi referensi, bukan total perjalanan satu siklus. Delay negatif memberi fase awal yang berbeda.
- Mobile: Simpangan dikalikan 0.65; durasi dan fase dipertahankan.
- Durasi dan jarak numerik merupakan pilihan implementasi agent; hasil animasi sudah diperiksa dan disetujui pengguna pada 11 Oktober 2026.

### Workflow dan penggunaan ulang

- Versi statis diperiksa oleh agent pada desktop dan mobile sebelum animasi ditambahkan.
- Class dasar floating-block dan modifier kedalamannya dapat digunakan kembali untuk ornamen sejenis pada batch terkait.
- Posisi ornamen pada section lain ditentukan dan diperiksa pada batch section tersebut; belum diimplementasikan pada Batch 2.

### Parallax scroll — pola bersama (keputusan 10 Oktober 2026)

- Keputusan pengguna: Menyetujui usulan parallax halus dengan kedalaman berbeda pada semua ornamen, dipadukan dengan loop mengambang yang sudah ada.
- Cakupan saat ini: Seluruh 39 ornamen di Hero, OUR MESSAGE, WHY US, MISSION, JOBS, INTERVIEW, CULTURE, SELECTION, dan FAQ, termasuk ornamen yang hanya tampil pada mobile.
- Arah relatif terhadap foto/section: Scroll menuju bawah menggeser ornamen ke atas; scroll menuju atas menggesernya ke bawah. Posisi kembali mengikuti lokasi section saat arah dibalik, tanpa akumulasi jarak.
- Koreksi intensitas (10 Oktober 2026): Pengguna menilai efek scroll terlalu samar. Batas gerak digandakan dan rentang respons dipersempit dengan memakai nilai terbesar antara tinggi viewport dan section sebagai pembagi progress, menggantikan jumlah keduanya. Smoothing dipercepat dari 160ms menjadi 120ms; arah, loop, batas progress, dan reduced-motion tetap. Hasil penguatan sudah diperiksa dan disetujui pengguna pada 11 Oktober 2026.
- Batas simpangan parallax: far ±1.5rem, middle ±3rem, lower ±3.75rem, near ±4.5rem (±24/48/60/72px pada root 16px). Pada lebar 768px ke bawah dikalikan 0.5. Ini tambahan terhadap loop mengambang yang parameternya tetap.
- Smoothing: Pendekatan eksponensial dengan konstanta waktu 120ms berbasis timestamp requestAnimationFrame, tanpa pantulan. Ketika scroll berhenti, parallax menyelesaikan pergeseran lalu berhenti memperbarui frame; loop CSS tetap berjalan.
- Implementasi: Section memakai data-parallax-section dan setiap ornamen memakai data-parallax-ornament. JavaScript memperbarui --parallax-progress pada section dalam rentang -1 sampai 1; CSS translate menerapkan pergeseran scroll secara terpisah dari transform loop. Ukuran, posisi dasar, warna, dan layer tetap.
- Aksesibilitas: prefers-reduced-motion menghentikan loop dan parallax; perubahan preferensi saat halaman terbuka ditangani. Pemrosesan parallax berhenti saat tab tersembunyi. Tanpa JavaScript, posisi dasar dan loop CSS tetap tersedia.
- Pemeriksaan hasil visual/gerak dan persetujuan pengguna: Batch 2–5 sudah diperiksa dan disetujui pada 11 Oktober 2026, termasuk penguatan intensitas parallax dan reduced-motion. Implementasi Batch 6–7 diterima tanpa koreksi; Batch 8 diterima pengguna tanpa koreksi pada 11 Oktober 2026; jenis pemeriksaan tidak dirinci. Batch 9–10 menunggu pemeriksaan pengguna.
- Pemeriksaan agent: Uji logika arah, smoothing, batas, penghentian frame, resize, dan reduced-motion lulus. Safari pada UI 1512px/390px mengonfirmasi arah scroll dua arah pada empat section, loop tetap berjalan, skala mobile 0.5, dan tidak ada overflow horizontal. Aktivasi sementara rule reduced-motion membuat seluruh 20 blok statis; rule kemudian dipulihkan tanpa perubahan pengaturan sistem. Rincian dan batas pemeriksaan dicatat di progress.md.

### OUR MESSAGE — Batch 3

- Acuan: references/sections/our message.jpg; menggunakan kembali metode CSS, warna, dan keputusan animasi loop mandiri dari pengguna, tanpa aset baru.
- Desktop: Tiga blok di sekitar foto: biru di belakang kiri atas, biru di belakang bawah, dan cyan di depan kanan. Posisi relatif terhadap message__media, dengan foto mempertahankan rasio 1112:790.
- Mobile: Tiga blok foto disesuaikan posisinya, ditambah tiga blok kecil pada bagian atas, sisi kanan, dan bawah section sesuai referensi. Dekorasi section berada di belakang konten; semuanya aria-hidden dan pointer-events none.
- Layer komposisi foto: Blok belakang/bawah z-index 0, foto 1, blok depan 2. Section memakai isolation dan overflow: clip.
- Kedalaman: Blok foto belakang memakai modifier far (14 detik, ±8px), bawah lower (10 detik, ±18px), depan near (8 detik, ±24px). Dekorasi mobile atas far, sisi middle (12 detik, ±14px), bawah lower. Fase, ease-in-out, loop infinite, dan reduced-motion memakai aturan bersama yang sudah ada. Mobile menggunakan skala simpangan 0.65.
- Pemeriksaan agent: Versi statis diperiksa pada viewport UI Safari 1512px dan 390px sebelum override animation none dihapus. Setelah animasi aktif, tampilan diperiksa pada 1512px, 1024px, dan 390px; runtime menunjukkan tiga blok desktop serta enam blok mobile berjalan infinite. Rule reduced-motion diuji dengan aktivasi sementara media rule di browser lalu dipulihkan, tanpa mengubah pengaturan sistem.
- Posisi dan ukuran adalah implementasi awal berdasarkan referensi; hasil Batch 3 sudah diperiksa dan disetujui pengguna pada 11 Oktober 2026.

### WHY US — Batch 4

- Acuan: references/sections/why us.jpg. Memakai kembali floating blocks CSS dengan warna dan animasi yang telah ditentukan; tidak memerlukan aset baru.
- Enam blok berada di belakang konten: kanan atas, kiri, dua blok tengah, kanan bawah, dan blok kecil bawah. Posisi/ukuran relatif terhadap section; pada mobile disesuaikan mengikuti empat kartu vertikal.
- Layer: Blok z-index 0; konten/kartu z-index 1 di dalam section dengan isolation dan overflow clip. Semua blok aria-hidden dan pointer-events none.
- Kedalaman: Atas/right memakai far, kiri/small memakai middle, center memakai lower, bottom memakai near. Durasi 14/12/10/8 detik dan fase memakai modifier bersama; simpangan mobile dikalikan 0.65. Kartu dan ikon tidak ikut dianimasikan.
- Pemeriksaan agent: Ornamen statis diperiksa pada desktop 1512px dan mobile 390px, lalu override animation none dihapus. Tampilan setelah animasi aktif diperiksa pada desktop 1512px, tablet 1024px, dan mobile kecil 320px. Runtime mengonfirmasi enam animasi running/infinite. Aktivasi sementara rule reduced-motion membuat keenam blok statis, lalu rule dipulihkan tanpa mengubah pengaturan sistem.
- Posisi dan ukuran diturunkan dari referensi; tampilan Batch 4 disetujui pada 9 Oktober 2026 dan poin animasi yang menunggu disetujui pada 11 Oktober 2026.

### MISSION — Batch 5

- Acuan: references/sections/mission.jpg. Menggunakan kembali floating blocks CSS, warna, dan keputusan animasi loop mandiri dari pengguna; tidak memerlukan aset baru.
- Desktop: Tiga blok mengelilingi foto di kolom kanan: cyan di belakang atas, biru di belakang kiri bawah, dan cyan di depan kanan bawah. Posisi relatif terhadap mission__media; foto mempertahankan rasio asli 1115:806.
- Mobile: Foto ditempatkan di atas konten; tiga blok foto disesuaikan dan satu blok biru ditambahkan di belakang sisi kiri CTA sesuai referensi.
- Koreksi bentuk (10 Oktober 2026): Blok atas MISSION memakai aspect-ratio 1:1 pada desktop/mobile. Bentuk penuh persegi, dengan bagian bawah tertutup foto; potongan yang terlihat di atas foto bukan tinggi keseluruhan blok. Lebar, posisi, layer, dan animasi tetap.
- Layer: Blok belakang z-index 0, foto 1, blok depan 2. Dekorasi section berada di belakang konten. Section memakai isolation dan overflow clip; semua ornamen aria-hidden dan pointer-events none.
- Kedalaman: Blok atas memakai middle (12 detik, ±14px), kiri bawah far (14 detik, ±8px), depan near (8 detik, ±24px), dan dekorasi mobile lower (10 detik, ±18px). Fase dan ease-in-out memakai aturan bersama; simpangan mobile dikalikan 0.65.
- Pemeriksaan agent (9 Oktober 2026): Komposisi statis diperiksa pada desktop 1512px dan mobile 390px sebelum animasi diaktifkan. Setelah aktif, tampilan diperiksa pada 1512px, 1024px, 390px, dan 320px. Runtime menunjukkan tiga animasi desktop dan empat animasi mobile berjalan infinite dengan durasi berbeda. Aktivasi sementara media rule reduced-motion membuat keempat blok statis, lalu rule dipulihkan tanpa mengubah pengaturan sistem.
- Posisi dan ukuran diturunkan dari referensi; hasil Batch 5 termasuk koreksi bentuk blok atas sudah diperiksa dan disetujui pengguna pada 11 Oktober 2026.

### JOBS — Batch 6 (11 Oktober 2026)

- Acuan: references/sections/jobs.jpg. Memakai kembali bentuk CSS, warna, loop, dan parallax yang sudah disetujui; tidak membutuhkan aset baru.
- Desktop: Tiga blok di belakang konten: biru besar pada kiri atas section, cyan kecil di kanan antara intro dan kartu, serta cyan di bawah kartu ENGINEER. Posisi relatif terhadap section, dengan kartu di layer z-index 1 dan ornamen di 0.
- Mobile: Blok atas diperkecil dan dipindahkan ke kanan intro; blok side ditempatkan di sudut kanan paling bawah, dan blok bottom di bawah kartu SALES. Ornamen tidak menutupi teks atau tombol; section menggunakan isolation dan overflow clip.
- Kedalaman: Top memakai far (loop ±8px/14 detik, parallax ±24px), side memakai middle (±14px/12 detik, parallax ±48px), bottom memakai near (±24px/8 detik, parallax ±72px). Mobile memakai skala loop 0.65 dan parallax 0.5. Fase, easing, smoothing 120ms, dan reduced-motion mengikuti aturan bersama.
- Implementasi: jobs memiliki data-parallax-section; ketiga blok memiliki data-parallax-ornament, aria-hidden, dan pointer-events none. JavaScript bersama digunakan tanpa perubahan.
- Pemeriksaan agent: Komposisi statis diperiksa pada viewport UI Safari 1512px dan 390px sebelum override statis dihapus. Setelah aktif, runtime pada UI 1512px, 1024px, 390px, dan 320px mengonfirmasi tiga loop running dengan durasi 14/12/8 detik serta tidak ada overflow horizontal. Pergeseran parallax dua arah diukur pada desktop dan mobile; rule reduced-motion diaktifkan sementara di browser, ketiga blok menjadi statis, lalu rule dipulihkan tanpa mengubah pengaturan sistem.
- Posisi, ukuran, dan hasil animasi Batch 6: Implementasi dikonfirmasi pengguna tanpa koreksi pada 11 Oktober 2026. Koreksi margin konten mobile global 24px menjadi 20px juga sudah diperiksa dan diterima pengguna tanpa koreksi pada 11 Oktober 2026.

### INTERVIEW — Batch 7 (11 Oktober 2026)

- Acuan: references/sections/interview.jpg. Memakai kembali floating blocks CSS, warna, loop, dan parallax yang sudah ditentukan; tidak membutuhkan aset baru.
- Desktop: Tujuh blok — biru pada kanan atas section dan kiri bawah, cyan depan kiri bawah kartu pertama, cyan belakang kiri atas kartu kedua, biru kecil di atas kanan kartu ketiga, biru besar belakang kanan atas kartu keempat, dan cyan belakang kiri CTA. Ukuran/posisi relatif terhadap section, kartu, atau actions.
- Mobile: Enam blok terlihat; blok depan kartu pertama disembunyikan. Blok kanan atas dan kiri section diperkecil; blok belakang kartu kedua, blok kecil kartu ketiga, blok besar kartu keempat, serta blok CTA disesuaikan mengikuti susunan satu kolom. Margin konten tetap 20px.
- Layer: Section isolation/overflow clip; dekorasi section z-index 0 dan container 1. Kartu memiliki stacking context sendiri; blok belakang 0, foto 1, blok depan 2, panel putih 3. Semua ornamen aria-hidden, pointer-events none, dan tidak ikut fokus.
- Kedalaman: Dua dekorasi section dan blok besar kartu keempat memakai far (14 detik, loop ±8px, parallax ±24px); depan kartu pertama near (8 detik, ±24px/±72px); belakang kartu kedua dan CTA middle (12 detik, ±14px/±48px); blok kecil kartu ketiga lower (10 detik, ±18px/±60px). Mobile memakai skala loop 0.65/parallax 0.5; easing, fase, smoothing 120ms, dan reduced-motion mengikuti aturan bersama.
- Implementasi: Section memiliki data-parallax-section dan ketujuh blok data-parallax-ornament. JavaScript bersama digunakan tanpa perubahan; total DOM saat ini 30 ornamen.
- Pemeriksaan agent: Statis diperiksa pada desktop 1512px/mobile 390px, kemudian override statis dihapus. Tampilan aktif dan overflow diperiksa pada 1512px, 1024px, 390px, dan 320px. Tujuh loop desktop/enam mobile terlihat aktif. Scroll 150px pada blok middle menunjukkan perubahan translate sekitar 6.72px desktop/3.34px mobile ke atas, lalu kembali ke bawah saat arah dibalik. Aktivasi sementara media rule reduced-motion membuat ketujuh blok statis; rule dipulihkan tanpa mengubah pengaturan sistem.
- Status pengguna: Pengguna menyatakan tidak ada koreksi pada Batch 7 (11 Oktober 2026); implementasi diterima tanpa koreksi. Jenis pemeriksaan tidak dirinci secara terpisah. Bagian yang sudah disetujui pada batch sebelumnya dipertahankan.

### CULTURE — Batch 8 (11 Oktober 2026)

- Acuan: references/sections/culture.jpg. Dua blok biru memakai metode CSS, loop, dan parallax yang sudah ditentukan; tidak memerlukan aset baru.
- Desktop: Blok kecil 58×58px di kanan atas section dan blok 132×132px di kiri bawah intro. Mobile: Blok atas 28×28px di kanan intro dan blok bawah 50×50px di kiri bawah slider. Keduanya #8DDCFA/opacity 0.35; warna biru dipertahankan juga pada modifier near sesuai referensi.
- Layer: Ornamen z-index 0, container 1; section memakai isolation dan overflow clip. Semua ornamen aria-hidden, pointer-events none, dan tidak masuk urutan fokus.
- Kedalaman: Top memakai far (14 detik, loop ±8px, parallax ±24px); bottom memakai near (8 detik, loop ±24px, parallax ±72px). Mobile memakai skala loop 0.65/parallax 0.5. Fase, easing, smoothing 120ms, dan reduced-motion mengikuti pola bersama.
- Implementasi: Section memakai data-parallax-section dan kedua blok data-parallax-ornament. JavaScript parallax bersama dipertahankan; modul carousel terpisah. Total DOM saat ini 32 ornamen.
- Pemeriksaan agent: Komposisi statis diperiksa pada desktop 1512px/mobile 390px sebelum animasi diaktifkan. Tampilan aktif diperiksa pada 1512px, 1024px, 390px, dan 320px; runtime desktop/390px menunjukkan loop 14/8 detik berjalan dan tidak ada overflow horizontal. Scroll 150px pada blok near menggeser translate sekitar 21.6px desktop/10.8px mobile ke atas, lalu kembali ke bawah saat arah dibalik. Aktivasi sementara media rule reduced-motion membuat kedua blok statis; rule dipulihkan tanpa perubahan pengaturan sistem. Pemeriksaan reduced-motion terbatas pada CSS dan audit kode JavaScript.
- Status pengguna: Batch 8 diterima pengguna tanpa koreksi pada 11 Oktober 2026; jenis pemeriksaan tidak dirinci secara terpisah.

### SELECTION dan FAQ — Batch 9–10 (11 Oktober 2026)

- Acuan: references/sections/selection - faq.jpg. Bentuk CSS, loop, parallax, warna biru #8DDCFA dan cyan #91EAF7, serta reduced-motion memakai pola yang telah disetujui; tidak memerlukan aset atau keputusan animasi baru.
- SELECTION: Tiga blok desktop—kanan atas far, sisi kiri middle, dan bawah near. Mobile menyesuaikan ukuran/posisinya serta menambahkan blok kecil sisi kanan lower. Terdapat empat elemen ornamen, dengan blok sisi kanan tersembunyi di desktop.
- FAQ: Tiga blok—sisi kanan far, cyan kecil middle, dan kiri bawah near; ukuran/posisi disesuaikan pada mobile. Semua blok di layer 0, konten layer 1, dengan isolation/overflow clip, aria-hidden dan pointer-events none.
- Implementasi: Kedua section memakai data-parallax-section; tujuh blok memakai data-parallax-ornament. JavaScript bersama tidak diubah. Total DOM 39 ornamen; 34 terlihat pada desktop dan 38 pada mobile sesuai aturan section sebelumnya.
- Pemeriksaan agent: Komposisi statis SELECTION/FAQ dilihat di Safari pada UI 1512px/390px sebelum animasi bersama diaktifkan. Setelah aktif, runtime menunjukkan durasi 14/12/10/8 detik dan loop infinite; blok lower SELECTION tersembunyi di desktop, semua tujuh blok tampil pada mobile dengan parallax-scale 0.5. Scroll turun 150px pada FAQ desktop mengubah translate ornamen near dari sekitar +9.03px ke −12.44px, lalu kembali ke sekitar +8.88px saat arah dibalik.
- Batas pemeriksaan: Safari viewport simulasi; reduced-motion diperiksa melalui aturan CSS/JS bersama yang sudah ada, tidak diuji ulang dengan pengaturan sistem atau perangkat fisik pada batch ini. Posisi, ukuran, dan hasil Batch 9–10 menunggu pemeriksaan serta persetujuan pengguna.

## Partikel blok tombol — 15 Oktober 2026

- Keputusan pengguna: Menggabungkan gradasi fade-in dari referensi pertama dengan partikel keluar tombol dari referensi kedua, berbentuk kotak kecil. Rencana disetujui pengguna untuk diimplementasikan.
- Pembuatan/penyedia: AI agent membuat elemen dekoratif dengan vanilla JavaScript dan animasi CSS; tidak membutuhkan Haml, SCSS, library, font/icon tambahan, atau aset gambar.
- Parameter implementasi: 16 kotak per tombol, ukuran 5–9px, empat sisi, jarak keluar 16–40px, variasi arah lateral ±16px (koreksi pengguna 15 Oktober 2026: partikel diperbesar dan penyebaran sedikit diperluas), durasi 650–1000ms, dan jeda 0–650ms. Warna biru/cyan; tombol terang memakai partikel lebih gelap. Gradasi tombol memakai transisi opacity 300ms.
- Cakupan: CTA berwarna, tombol kartu INTERVIEW, serta kotak panah CULTURE. Hover loop pada pointer fine yang mendukung hover; fokus keyboard setara. Partikel berhenti saat hover/fokus berakhir, kartu menjadi inert, halaman disembunyikan, atau reduced-motion aktif. Reduced-motion memberi background statis tanpa partikel.
- Layer: Satu .button-effects fixed dengan pointer-events none dan aria-hidden true pada body. Emitter mengikuti bounding rect tombol; lapisan ini melewati clipping section/slider, tetapi tetap dipotong batas viewport agar tidak menambah scroll horizontal. Kotak hanya berasal dari tepi tombol, bukan dari teks.
- Penggunaan ulang: Hook data-button-effect pada HTML. Inisialisasi setelah slider membuat klon; satu emitter per target dan 16 partikel disiapkan satu kali, tanpa membuat node setiap hover/frame. State dan koordinat di JavaScript, styling/gerakan di CSS. Ornamen section yang sudah disetujui tetap.
- Pemeriksaan: Sintaks JavaScript dan uji logika DOM tiruan lulus. Pengujian browser pertama belum memuat lapisan baru; versi URL CSS/JS diperbarui untuk pemuatan revisi terbaru. Verifikasi visual pasca pembaruan belum selesai karena kontrol jendela browser gagal (cgWindowNotFound). Persetujuan hasil tampilan tetap menunggu pengguna.

### Partikel satu warna pada link teks — 15 Oktober 2026

- OUR MESSAGE dan lima link navigasi FOOTER memakai ulang emitter kotak dengan satu warna per link: OUR MESSAGE #065fcd; FOOTER #ffffff. Sebutan pengguna "yang di hover" ditafsirkan sebagai footer berdasarkan konteks koreksi sebelumnya.
- Hook data-button-effect="text" mengaktifkan partikel tanpa menambahkan pseudo-element gradasi tombol. Warna ditentukan data-button-particle-color; data-button-particle-origin="label" pada FOOTER membatasi sumber partikel ke label, bukan panah.
- Sumber partikel mengikuti background: seluruh link/panah OUR MESSAGE atau label FOOTER. Ruang 10px kiri/kanan berupa padding internal hanya saat hover/fokus. Pada state normal padding 0 agar posisi awal tetap; emitter mengikuti ukuran elemen selama transisi, tanpa perluasan negatif ke kiri (koreksi lanjutan 15 Oktober 2026). Sapuan solid, warna teks, dan partikel tombol/CULTURE sebelumnya tetap.
- Jumlah, ukuran, sebaran, dan timing mengikuti parameter blok tombol: 16 kotak, 5–9px, jarak 16–40px, lateral ±16px, durasi 650–1000ms, jeda 0–650ms. Hover pointer fine serta fokus keyboard; touch tanpa hover dan reduced-motion tanpa partikel. Lapisan tetap dekoratif, aria-hidden dan pointer-events none.
- Hasil implementasi menunggu pemeriksaan pengguna; verifikasi styling/runtime Safari memakai event pointer simulasi pada viewport 390/1512px, bukan perangkat fisik atau pengujian lintas browser.
