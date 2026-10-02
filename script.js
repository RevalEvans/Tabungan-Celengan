// KUNCI AKSES AKUN: USERNAME YAN SEN DIUBAH MENJADI REVAL
const DAFTAR_USER = [
    { username: "reval", password: "11142006", namaLengkap: "Yan Sen", role: "yansen", emoji: "👨‍💻" },
    { username: "cece", password: "05122007", namaLengkap: "Cece", role: "cece", emoji: "👩‍🎨" },
    { username: "admin", password: "09032023", namaLengkap: "Admin Cinta", role: "admin", emoji: "🤖" },
    { username: "tamu", password: "98345398", namaLengkap: "Tamu Spesial", role: "tamu", emoji: "✨" }
];

// MENGAMBIL DATA AWAL TARGET DINAMIS
let currentTargetName = localStorage.getItem('targetName') || "Menikah & Masa Depan";
let currentTargetAmount = parseInt(localStorage.getItem('targetAmount')) || 50000000;

// Mengambil Data Awal Transaksi
let savingsData = JSON.parse(localStorage.getItem('coupleSavings')) || [];

// Pengecekan Session Login Saat Halaman Dimuat
window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        showApp();
    }
});

// Dinamis mengganti teks tombol berdasarkan jenis transaksi
document.getElementById('type').addEventListener('change', function() {
    const btn = document.getElementById('btnSubmitForm');
    if (this.value === 'masuk') {
        btn.innerText = "Masukkan ke Celengan! 💰";
        btn.style.backgroundColor = "var(--primary-blue)";
    } else {
        btn.innerText = "Tarik dari Celengan! 💸";
        btn.style.backgroundColor = "#FF6B6B";
    }
});

// 1. VALIDASI LOGIN
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const inputUsername = document.getElementById('username').value.trim().toLowerCase();
    const inputPassword = document.getElementById('password').value.trim();
    
    const userDitemukan = DAFTAR_USER.find(user => user.username === inputUsername && user.password === inputPassword);

    if (userDitemukan) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('namaUser', userDitemukan.namaLengkap);
        sessionStorage.setItem('roleUser', userDitemukan.role); // Simpan role untuk fitur rahasia
        
        const selectSaver = document.getElementById('saver');
        if(selectSaver) {
            selectSaver.value = userDitemukan.namaLengkap;
        }

        showApp();
        createHeartsExplosion();
    } else {
        alert("❌ Kombinasi Username & Password salah!");
    }
    
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

function showApp() {
    document.getElementById('login-page').classList.add('d-none');
    document.getElementById('main-app').classList.remove('d-none');
    
    document.getElementById('inputTargetName').value = currentTargetName;
    document.getElementById('inputTargetAmount').value = currentTargetAmount;
    
    // AKSES RAHASIA YAN SEN / REVAL UNTUK MELIHAT SEMUA PASSWORD
    const roleSekarang = sessionStorage.getItem('roleUser');
    if (roleSekarang === 'yansen' && !document.getElementById('btnSecretSpy')) {
        const headerCard = document.querySelector('.header-card');
        const spyButton = document.createElement('button');
        spyButton.id = "btnSecretSpy";
        spyButton.innerText = "🔑 Intip Semua Password";
        spyButton.style.marginTop = "15px";
        spyButton.style.backgroundColor = "#FFD166";
        spyButton.classList.add('btn-small');
        
        spyButton.addEventListener('click', () => {
            let teksPassword = "=== DAFTAR PASSWORD RAHASIA ===\n\n";
            DAFTAR_USER.forEach(u => {
                teksPassword += `• User: ${u.namaLengkap}\n  Username: ${u.username}\n  Password: ${u.password}\n\n`;
            });
            alert(teksPassword);
        });
        
        headerCard.appendChild(spyButton);
    }
    
    renderData();
}

document.getElementById('btnLogout').addEventListener('click', () => {
    sessionStorage.clear();
    location.reload();
});

// 2. MENGATUR TARGET
const btnEditTarget = document.getElementById('btnEditTarget');
const editTargetFormContainer = document.getElementById('editTargetFormContainer');

btnEditTarget.addEventListener('click', () => {
    editTargetFormContainer.classList.toggle('d-none');
});

document.getElementById('btnSaveTarget').addEventListener('click', () => {
    const newName = document.getElementById('inputTargetName').value.trim();
    const newAmount = parseInt(document.getElementById('inputTargetAmount').value);

    if (!newName || isNaN(newAmount) || newAmount <= 0) {
        alert("❌ Harap isi form target dengan benar!");
        return;
    }

    currentTargetName = newName;
    currentTargetAmount = newAmount;

    localStorage.setItem('targetName', currentTargetName);
    localStorage.setItem('targetAmount', currentTargetAmount);

    editTargetFormContainer.classList.add('d-none');
    renderData();
    createHeartsExplosion();
});

// 3. INPUT TRANSAKSI (MASUK & KELUAR)
document.getElementById('savingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const saver = document.getElementById('saver').value;
    const amountInput = document.getElementById('amount').value;
    const note = document.getElementById('note').value;
    const amount = parseInt(amountInput);

    if (isNaN(amount) || amount <= 0) return;

    const newRecord = {
        id: Date.now(),
        type: type,
        saver: saver,
        amount: amount,
        note: note
    };

    savingsData.unshift(newRecord);
    localStorage.setItem('coupleSavings', JSON.stringify(savingsData));

    renderData();
    createHeartsExplosion();

    document.getElementById('amount').value = '';
    document.getElementById('note').value = '';
});

// 4. HAPUS TRANSAKSI
function deleteTransaction(id) {
    if (confirm("Apakah kamu yakin ingin menghapus catatan ini? 🥺")) {
        savingsData = savingsData.filter(item => item.id !== id);
        localStorage.setItem('coupleSavings', JSON.stringify(savingsData));
        renderData();
    }
}

// 5. RENDER DATA & HITUNG GRAFIK VISUAL
function renderData() {
    document.getElementById('targetNameText').innerText = currentTargetName;
    document.getElementById('targetAmountText').innerText = `Rp ${currentTargetAmount.toLocaleString('id-ID')}`;

    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = ''; 

    let totalSaved = 0;
    let yansenTotal = 0;
    let ceceTotal = 0;

    savingsData.forEach(item => {
        const isMasuk = item.type === 'masuk';
        
        if (isMasuk) {
            totalSaved += item.amount;
            if (item.saver === 'Yan Sen') yansenTotal += item.amount;
            if (item.saver === 'Cece') ceceTotal += item.amount;
        } else {
            totalSaved -= item.amount;
            if (item.saver === 'Yan Sen') yansenTotal -= item.amount;
            if (item.saver === 'Cece') ceceTotal -= item.amount;
        }

        const newRow = document.createElement('tr');
        const infoUser = DAFTAR_USER.find(u => u.namaLengkap === item.saver);
        const badgeClass = infoUser ? infoUser.role : 'yansen';
        const avatarEmoji = infoUser ? infoUser.emoji + ' ' : '👤 ';

        const displayAmount = isMasuk ? `+ Rp ${item.amount.toLocaleString('id-ID')}` : `- Rp ${item.amount.toLocaleString('id-ID')}`;
        const amountClass = isMasuk ? 'amount-plus' : 'amount-minus';

        newRow.innerHTML = `
            <td><span class="badge ${badgeClass}">${avatarEmoji}${item.saver}</span></td>
            <td class="${amountClass}">${displayAmount}</td>
            <td>${item.note}</td>
            <td><button class="btn-delete" onclick="deleteTransaction(${item.id})">❌ Hapus</button></td>
        `;
        transactionList.appendChild(newRow);
    });

    if (totalSaved < 0) totalSaved = 0;
    if (yansenTotal < 0) yansenTotal = 0;
    if (ceceTotal < 0) ceceTotal = 0;

    document.getElementById('totalSaved').innerText = `Rp ${totalSaved.toLocaleString('id-ID')}`;
    
    let leftAmount = currentTargetAmount - totalSaved;
    if(leftAmount < 0) leftAmount = 0;
    document.getElementById('leftAmount').innerText = `Rp ${leftAmount.toLocaleString('id-ID')}`;

    let percentage = Math.round((totalSaved / currentTargetAmount) * 100);
    if (percentage > 100) percentage = 100;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = percentage + '%';
    progressBar.innerText = percentage + '%';

    let totalNettoCouple = yansenTotal + ceceTotal;
    let yansenPercent = 0;
    let cecePercent = 0;

    if (totalNettoCouple > 0) {
        yansenPercent = Math.round((yansenTotal / totalNettoCouple) * 100);
        cecePercent = Math.round((ceceTotal / totalNettoCouple) * 100);
    }

    const barYansen = document.getElementById('chartBarYansen');
    const barCece = document.getElementById('chartBarCece');

    barYansen.style.width = (totalNettoCouple === 0 ? 50 : yansenPercent) + '%';
    barYansen.innerText = `Rp ${yansenTotal.toLocaleString('id-ID')} (${yansenPercent}%)`;

    barCece.style.width = (totalNettoCouple === 0 ? 50 : cecePercent) + '%';
    barCece.innerText = `Rp ${ceceTotal.toLocaleString('id-ID')} (${cecePercent}%)`;
}

// 6. ANIMASI HATI
function createHeartsExplosion() {
    const container = document.getElementById('hearts-container');
    const heartEmojis = ['💖', '❤️', '💕', '💝', '🐷', '💰'];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDelay = Math.random() * 0.4 + 's';
        heart.style.fontSize = Math.random() * 20 + 20 + 'px';
        container.appendChild(heart);
        setTimeout(() => {
            heart.remove();
        }, 2000);
    }}