// Data penyimpanan menggunakan Firebase Firestore
let savingsData = [];
let unsubscribe = null;

// Fungsi untuk menyimpan data ke Firestore
async function saveData(entry) {
    try {
        await db.collection('savings').add({
            ...entry,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error saving data:', error);
        showNotification('Gagal menyimpan data. Periksa koneksi internet.', 'error');
    }
}

// Fungsi untuk memuat data dari Firestore
function loadData() {
    if (unsubscribe) {
        unsubscribe();
    }

    unsubscribe = db.collection('savings')
        .orderBy('timestamp', 'desc')
        .onSnapshot((querySnapshot) => {
            savingsData = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                savingsData.push({
                    id: doc.id,
                    person: data.person,
                    amount: data.amount,
                    date: data.date,
                    type: data.type || 'tambah'
                });
            });

            updateTotals();
            updateHistory();
        }, (error) => {
            console.error('Error loading data:', error);
            showNotification('Gagal memuat data. Periksa koneksi internet.', 'error');
        });
}

// Fungsi untuk menampilkan total nabung
function updateTotals() {
    let totalKasya = 0;
    let totalCasa = 0;

    savingsData.forEach(entry => {
        if (entry.person === 'kasya') {
            totalKasya += entry.amount;
        } else if (entry.person === 'casa') {
            totalCasa += entry.amount;
        }
    });

    document.getElementById('totalKasya').textContent = totalKasya.toLocaleString('id-ID');
    document.getElementById('totalCasa').textContent = totalCasa.toLocaleString('id-ID');
    document.getElementById('totalBersama').textContent = (totalKasya + totalCasa).toLocaleString('id-ID');
}

// Fungsi untuk format angka dengan titik
function formatNumber(input) {
    let value = input.value.replace(/\D/g, '');
    input.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parseInt(value) || 0;
}

// Fungsi untuk menampilkan riwayat nabung
function updateHistory() {
    const historyList = document.getElementById('historyList');
    const noHistory = document.getElementById('noHistory');

    historyList.innerHTML = '';

    if (savingsData.length === 0) {
        noHistory.style.display = 'block';
        return;
    }

    noHistory.style.display = 'none';

    // Urutkan data berdasarkan tanggal terbaru
    const sortedData = [...savingsData].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedData.forEach(entry => {
        const li = document.createElement('li');
        const formattedDate = new Date(entry.date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        li.innerHTML = `
            <div class="history-item">
                <div class="history-icon">
                    <i class="fas fa-${entry.person === 'kasya' ? 'user' : 'user'}"></i>
                </div>
                <div class="history-content">
                    <div class="history-person">${entry.person === 'kasya' ? 'Kasya' : 'Casa'}</div>
                    <div class="history-amount">Rp ${entry.amount.toLocaleString('id-ID')}</div>
                    <div class="history-date">${formattedDate}</div>
                    <div class="history-type">${entry.type === 'tambah' ? 'Menambah Nabung' : 'Pembayaran Nabung'}</div>
                </div>
            </div>
        `;
        historyList.appendChild(li);
    });
}

// Fungsi untuk animasi angka
function animateNumber(element, target) {
    const start = parseInt(element.textContent.replace(/\D/g, '')) || 0;
    const duration = 1000;
    const step = (target - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += step;
        if ((step > 0 && current >= target) || (step < 0 && current <= target)) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString('id-ID');
    }, 16);
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Fungsi untuk membuka modal QRIS
function openPaymentModal(person, amount) {
    const modal = document.getElementById('paymentModal');
    const paymentAmount = document.getElementById('paymentAmount');
    const paymentPerson = document.getElementById('paymentPerson');

    paymentAmount.textContent = `Rp ${amount.toLocaleString('id-ID')}`;
    paymentPerson.textContent = person === 'kasya' ? 'Kasya' : 'Casa';

    modal.classList.add('show');

    // Event listener untuk tombol konfirmasi
    document.getElementById('confirmPayment').onclick = function() {
        // Simulasi pembayaran berhasil
        showNotification(`Pembayaran berhasil! Rp ${amount.toLocaleString('id-ID')} telah dibayarkan untuk ${person === 'kasya' ? 'Kasya' : 'Casa'}.`, 'success');
        modal.classList.remove('show');

        // Tambahkan entry pembayaran ke data
        savingsData.push({
            person,
            amount,
            date: new Date().toISOString().split('T')[0],
            type: 'bayar'
        });

        // Simpan data
        saveData();

        // Update tampilan
        updateTotals();
        updateHistory();
    };

    // Event listener untuk tombol batal
    document.getElementById('cancelPayment').onclick = function() {
        modal.classList.remove('show');
        showNotification('Pembayaran dibatalkan.', 'error');
    };

    // Event listener untuk close modal
    document.querySelector('.close-modal').onclick = function() {
        modal.classList.remove('show');
    };

    // Close modal ketika klik di luar
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    };
}

// Event listener untuk input amount dengan format
document.getElementById('amount').addEventListener('input', function() {
    formatNumber(this);
});

// Event listener untuk form submit
document.getElementById('savingsForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const person = document.getElementById('person').value;
    const amountInput = document.getElementById('amount');
    const amount = formatNumber(amountInput);
    const date = document.getElementById('date').value;
    const action = document.querySelector('input[name="action"]:checked').value;

    if (amount <= 0) {
        showNotification('Jumlah nabung harus lebih dari 0!', 'error');
        return;
    }

    if (action === 'bayar') {
        // Buka modal QRIS untuk pembayaran
        openPaymentModal(person, amount);
        return;
    }

    // Tambah nabung biasa
    savingsData.push({ person, amount, date, type: 'tambah' });

    // Simpan data
    saveData();

    // Update tampilan
    updateTotals();
    updateHistory();

    // Reset form
    this.reset();

    // Tampilkan notifikasi
    showNotification(`Berhasil menambah nabung Rp ${amount.toLocaleString('id-ID')} untuk ${person === 'kasya' ? 'Kasya' : 'Casa'}!`);

    // Animasi sukses
    const button = this.querySelector('button');
    button.innerHTML = '<i class="fas fa-check"></i> Berhasil!';
    button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';

    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-save"></i> Proses';
        button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 2000);
});

// Set tanggal default ke hari ini
document.getElementById('date').valueAsDate = new Date();

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Tunggu Firebase siap
    setTimeout(() => {
        loadData();
    }, 1000);
});
