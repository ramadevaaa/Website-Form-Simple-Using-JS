// === Ambil elemen utama ===
const form = document.querySelector("#formMahasiswa");
const fotoInput = document.querySelector("#foto");
const previewImg = document.querySelector("#preview-img");

// === Preview Foto Otomatis ===
fotoInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    previewImg.src = "";
    previewImg.style.display = "none";
  }
});

// === Validasi dan Submit ===
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Hapus pesan error & border merah sebelumnya
  document.querySelectorAll(".error-text").forEach(e => e.remove());
  document.querySelectorAll(".error-border").forEach(el => el.classList.remove("error-border"));

  // Ambil data input
  const nama = form.nama.value.trim();
  const nim = form.nim.value.trim();
  const prodi = form.prodi.value;
  const email = form.email.value.trim();
  const gender = form.gender.value;
  const tgl = form.tgl.value;
  const alamat = form.alamat.value.trim();
  const foto = previewImg.src;

  let valid = true;

  // === Validasi Nama ===
  if (!nama || nama.length > 30) {
    markError("nama", "Nama wajib diisi (maksimal 30 karakter)");
    valid = false;
  }

  // === Validasi NIM ===
  if (!/^[0-9]{10,}$/.test(nim)) {
    markError("nim", "NIM harus berupa angka minimal 10 digit");
    valid = false;
  }

  // === Validasi Email ===
  if (!email.includes("@") || !email.includes(".")) {
    markError("email", "Format email tidak valid");
    valid = false;
  }

  // === Validasi Gender ===
  if (!gender) {
    const group = form.querySelector(".radio-group");
    const msg = document.createElement("div");
    msg.classList.add("error-text");
    msg.textContent = "Pilih jenis kelamin";
    group.appendChild(msg);
    valid = false;
  }

  // === Validasi Prodi ===
  if (!prodi) {
    markError("prodi", "Pilih program studi terlebih dahulu");
    valid = false;
  }

  // === Validasi Tanggal Lahir ===
  if (!tgl) {
    markError("tgl", "Tanggal lahir wajib diisi");
    valid = false;
  }

  // === Validasi Alamat ===
  if (alamat.length < 10) {
    markError("alamat", "Alamat minimal 10 karakter");
    valid = false;
  }

  // === Validasi Foto ===
  if (!foto || foto === "") {
    markError("foto", "Upload foto profil terlebih dahulu");
    valid = false;
  }

  // === Jika ada error, hentikan proses ===
  if (!valid) {
    alert("⚠️ Periksa kembali input yang belum benar!");
    return;
  }

  // === Simpan ke localStorage ===
  const data = {
    nama,
    nim,
    prodi,
    email,
    gender,
    tgl,
    alamat,
    foto,
    waktu: new Date().toLocaleString(),
  };

  const daftar = JSON.parse(localStorage.getItem("daftarMahasiswa")) || [];
  daftar.push(data);
  localStorage.setItem("daftarMahasiswa", JSON.stringify(daftar));

  // === Tampilkan popup sukses ===
  showPopup();
  form.reset();
  previewImg.style.display = "none";
});

// === Fungsi bantu buat pesan error ===
function markError(id, message) {
  const inputField = document.querySelector(`#${id}`);
  if (!inputField) return;

  const parent = inputField.closest(".form-grup");
  inputField.classList.add("error-border");

  const oldError = parent.querySelector(".error-text");
  if (oldError) oldError.remove();

  const errorMsg = document.createElement("div");
  errorMsg.classList.add("error-text");
  errorMsg.textContent = message;
  parent.appendChild(errorMsg);
}

// === Fungsi Popup sukses ===
function showPopup() {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `
    <div class="popup-content">
      <h3>✅ Data Berhasil Dikirim!</h3>
      <p>Semua input valid dan tersimpan di localStorage.</p>
      <button id="lihatData">Lihat Data Tersimpan</button>
      <button id="closePopup">Tutup</button>
    </div>
  `;
  document.body.appendChild(popup);

  document.querySelector("#closePopup").addEventListener("click", () => popup.remove());
  document.querySelector("#lihatData").addEventListener("click", () => {
    popup.remove();
    tampilkanDataTersimpan();
  });
}

// === Tampilkan data tersimpan ===
function tampilkanDataTersimpan() {
  const data = JSON.parse(localStorage.getItem("daftarMahasiswa")) || [];
  if (data.length === 0) {
    alert("Belum ada data tersimpan!");
    return;
  }

  const daftarPopup = document.createElement("div");
  daftarPopup.classList.add("popup");
  daftarPopup.innerHTML = `
    <div class="popup-content" style="max-height:80vh; overflow:auto;">
      <h3>📋 Daftar Mahasiswa Tersimpan</h3>
      <div id="data-list">${buatIsiData()}</div>
      <div class="popup-buttons">
        <button id="closeData">Tutup</button>
      </div>
    </div>
  `;
  document.body.appendChild(daftarPopup);

  // Tombol Tutup
  document.querySelector("#closeData").addEventListener("click", () => daftarPopup.remove());

  // Tombol Refresh
  document.querySelector("#refreshData").addEventListener("click", () => {
    const list = document.querySelector("#data-list");
    list.innerHTML = buatIsiData();
  });
}

// === Fungsi bantu isi daftar mahasiswa ===
function buatIsiData() {
  const data = JSON.parse(localStorage.getItem("daftarMahasiswa")) || [];
  return data
    .map(
      (mhs, i) => `
      <div class="card-mhs">
        <img src="${mhs.foto}" class="foto-mhs">
        <div class="info-mhs">
          <p><b>${i + 1}. ${mhs.nama}</b> (${mhs.nim})</p>
          <p>${mhs.prodi} - ${mhs.gender}</p>
          <p>${mhs.email}</p>
          <small>${mhs.alamat}</small><br>
          <small><i>${mhs.waktu}</i></small>
        </div>
      </div>
    `
    )
    .join("");
}
