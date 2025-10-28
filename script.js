// Ambil elemen form
const form = document.querySelector("#formMahasiswa");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // mencegah reload halaman

  // Ambil data dari form
  const nama = form.nama.value.trim();
  const nim = form.nim.value.trim();
  const gender = form.gender.value;
  const prodi = form.prodi.value;

  // Validasi sederhana
  if (!nama || !nim || !gender || !prodi) {
    alert(" Mohon isi semua field dengan benar!");
    return;
  }

  // Buat objek data
  const dataMahasiswa = {
    nama,
    nim,
    gender,
    prodi,
    waktu: new Date().toLocaleString()
  };

  // Simpan ke localStorage (ubah ke JSON string)
  let daftarMahasiswa = JSON.parse(localStorage.getItem("daftarMahasiswa")) || [];
  daftarMahasiswa.push(dataMahasiswa);
  localStorage.setItem("daftarMahasiswa", JSON.stringify(daftarMahasiswa));

  // Tampilkan popup sukses
  showPopup();

  // Reset form setelah kirim
  form.reset();
});


// Fungsi popup
function showPopup() {
  // Buat elemen popup
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `
    <div class="popup-content">
      <h3>Data Berhasil Dikirim!</h3>
      <p>Terima kasih, data kamu sudah tersimpan.</p>
      <button id="closePopup">Tutup</button>
    </div>
  `;

  document.body.appendChild(popup);

  // Event tombol tutup
  document.querySelector("#closePopup").addEventListener("click", () => {
    popup.remove();
  });
}

