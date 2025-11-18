// Data penyimpanan menggunakan localStorage
let savingsData = [];

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
    try {
        localStorage.setItem('savingsData', JSON.stringify(savingsData));
        console.log('Data saved to localStorage');
    } catch (error) {
        console.error('Error saving data:', error);
        showNotification('Gagal menyimpan data.', 'error');
    }
}

// Fungsi untuk memuat data dari localStorage
function loadData() {
    try {
        const stored = localStorage.getItem('savingsData');
        if (stored) {
            savingsData = JSON.parse(stored);
        }
        updateTotals();
        updateHistory();
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Gagal memuat data.', 'error');
    }
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
    const savingsHistoryList = document.getElementById('savingsHistoryList');
    const noSavingsHistory = document.getElementById('noSavingsHistory');
    const withdrawalHistoryList = document.getElementById('withdrawalHistoryList');
    const noWithdrawalHistory = document.getElementById('noWithdrawalHistory');

    savingsHistoryList.innerHTML = '';
    withdrawalHistoryList.innerHTML = '';

    // Filter data berdasarkan tipe
    const savingsDataFiltered = savingsData.filter(entry => entry.type === 'tambah' || entry.type === 'bayar');
    const withdrawalDataFiltered = savingsData.filter(entry => entry.type === 'tarik');

    // Riwayat Nabung
    if (savingsDataFiltered.length === 0) {
        noSavingsHistory.style.display = 'block';
    } else {
        noSavingsHistory.style.display = 'none';

        // Urutkan data berdasarkan tanggal terbaru
        const sortedSavingsData = [...savingsDataFiltered].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedSavingsData.forEach((entry, index) => {
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
                    <div class="history-actions">
                        <button class="delete-btn" data-index="${savingsData.indexOf(entry)}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            savingsHistoryList.appendChild(li);
        });
    }

    // Riwayat Penarikan
    if (withdrawalDataFiltered.length === 0) {
        noWithdrawalHistory.style.display = 'block';
    } else {
        noWithdrawalHistory.style.display = 'none';

        // Urutkan data berdasarkan tanggal terbaru
        const sortedWithdrawalData = [...withdrawalDataFiltered].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedWithdrawalData.forEach((entry, index) => {
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
                        <div class="history-amount withdrawal">Rp ${Math.abs(entry.amount).toLocaleString('id-ID')}</div>
                        <div class="history-date">${formattedDate}</div>
                        <div class="history-type">Penarikan Nabung</div>
                    </div>
                    <div class="history-actions">
                        <button class="delete-btn" data-index="${savingsData.indexOf(entry)}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            withdrawalHistoryList.appendChild(li);
        });
    }
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

    if (action === 'tarik') {
        // Penarikan nabung - kurangi dari total
        const currentTotal = person === 'kasya' ? parseInt(document.getElementById('totalKasya').textContent.replace(/\D/g, '')) : parseInt(document.getElementById('totalCasa').textContent.replace(/\D/g, ''));

        if (amount > currentTotal) {
            showNotification(`Saldo tidak cukup! Saldo ${person === 'kasya' ? 'Kasya' : 'Casa'} saat ini: Rp ${currentTotal.toLocaleString('id-ID')}`, 'error');
            return;
        }

        savingsData.push({ person, amount: -amount, date, type: 'tarik' });

        // Simpan data
        saveData();

        // Update tampilan
        updateTotals();
        updateHistory();

        // Reset form
        this.reset();

        // Tampilkan notifikasi
        showNotification(`Berhasil menarik nabung Rp ${amount.toLocaleString('id-ID')} untuk ${person === 'kasya' ? 'Kasya' : 'Casa'}!`);

        // Animasi sukses
        const button = this.querySelector('button');
        button.innerHTML = '<i class="fas fa-check"></i> Berhasil!';
        button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';

        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-save"></i> Proses';
            button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 2000);
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

// Fungsi untuk menghapus entry nabung
function deleteEntry(index) {
    const entryToDelete = savingsData[index];
    const typeText = entryToDelete.type === 'tarik' ? 'penarikan' : 'nabung';

    if (confirm(`Apakah Anda yakin ingin menghapus riwayat ${typeText} ini?`)) {
        savingsData.splice(index, 1);
        saveData();
        updateTotals();
        updateHistory();
        showNotification(`Riwayat ${typeText} berhasil dihapus.`, 'success');
    }
}

// Event listener untuk tombol delete
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
        const button = e.target.closest('.delete-btn');
        const index = parseInt(button.getAttribute('data-index'));
        deleteEntry(index);
    }
});

// Fungsi untuk export data ke file JSON
function exportData() {
    const dataStr = JSON.stringify(savingsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nabung-bareng-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Data berhasil diekspor!', 'success');
}

// Fungsi untuk import data dari file JSON
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                savingsData = importedData;
                saveData();
                updateTotals();
                updateHistory();
                showNotification('Data berhasil diimpor!', 'success');
            } else {
                showNotification('Format file tidak valid.', 'error');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            showNotification('Gagal mengimpor data.', 'error');
        }
    };
    reader.readAsText(file);
}

// Auto-save setiap 30 detik
setInterval(saveData, 30000);

// Save data sebelum halaman ditutup
window.addEventListener('beforeunload', saveData);

// Event listener untuk tombol export
document.getElementById('exportBtn').addEventListener('click', exportData);

// Event listener untuk input import
document.getElementById('importInput').addEventListener('change', importData);

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});
