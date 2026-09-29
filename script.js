// Data contoh awal
var sampleTickets = [
  {
    id: "TCK-1001",
    reporter: "Ahmad Yani",
    department: "Keuangan",
    category: "Hardware",
    priority: "Tinggi",
    description: "Layar monitor LG menampilkan pesan error 'D-SUB Out of Range'.",
    status: "Open"
  },
  {
    id: "TCK-1002",
    reporter: "Siti Rahma",
    department: "Administrasi",
    category: "CCTV",
    priority: "Sedang",
    description: "Kamera CCTV di area Gudang Bahan Baku kehilangan sinyal video.",
    status: "Dalam Proses"
  },
  {
    id: "TCK-1003",
    reporter: "Eko Prasetyo",
    department: "SDM",
    category: "Software",
    priority: "Rendah",
    description: "Aplikasi WPS Office mengalami crash saat membuka dokumen laporan.",
    status: "Selesai"
  }
];

// Inisialisasi Data dari LocalStorage atau Data Contoh
var tickets = JSON.parse(localStorage.getItem("it_tickets")) || sampleTickets;

// Fungsi Simpan ke LocalStorage
function saveTickets() {
  localStorage.setItem("it_tickets", JSON.stringify(tickets));
  renderApp();
}

// Render Seluruh Aplikasi
function renderApp() {
  renderTable(tickets);
  updateStats();
}

// Update Angka Statistik
function updateStats() {
  document.getElementById("stat-total").innerText = tickets.length;
  document.getElementById("stat-open").innerText = tickets.filter(function(t) { return t.status === "Open"; }).length;
  document.getElementById("stat-process").innerText = tickets.filter(function(t) { return t.status === "Dalam Proses"; }).length;
  document.getElementById("stat-resolved").innerText = tickets.filter(function(t) { return t.status === "Selesai"; }).length;
}

// Render Tabel Tiket
function renderTable(data) {
  var tbody = document.getElementById("ticket-table-body");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Tidak ada data tiket.</td></tr>';
    return;
  }

  data.forEach(function(ticket) {
    var statusClass = "badge-open";
    if (ticket.status === "Dalam Proses") statusClass = "badge-process";
    if (ticket.status === "Selesai") statusClass = "badge-resolved";

    var tr = document.createElement("tr");
    
    var col1 = "<td><b>" + ticket.id + "</b></td>";
    var col2 = "<td>" + ticket.reporter + "<br><small style='color:#64748b'>" + ticket.department + "</small></td>";
    var col3 = "<td>" + ticket.category + "</td>";
    var col4 = "<td>" + ticket.priority + "</td>";
    var col5 = "<td><span class='badge " + statusClass + "'>" + ticket.status + "</span></td>";
    var col6 = "<td><button class='btn-action' onclick='changeStatus(\"" + ticket.id + "\")'>🔄 Status</button><button class='btn-action' onclick='deleteTicket(\"" + ticket.id + "\")' style='color:red;'>🗑️</button></td>";

    tr.innerHTML = col1 + col2 + col3 + col4 + col5 + col6;
    tbody.appendChild(tr);
  });
}

// Tambah Tiket Baru
document.getElementById("ticket-form").addEventListener("submit", function(e) {
  e.preventDefault();

  var newTicket = {
    id: "TCK-" + Math.floor(1000 + Math.random() * 9000),
    reporter: document.getElementById("reporter").value,
    department: document.getElementById("department").value,
    category: document.getElementById("category").value,
    priority: document.getElementById("priority").value,
    description: document.getElementById("description").value,
    status: "Open"
  };

  tickets.unshift(newTicket);
  saveTickets();
  this.reset();
});

// Ubah Status Tiket
function changeStatus(id) {
  tickets = tickets.map(function(t) {
    if (t.id === id) {
      if (t.status === "Open") t.status = "Dalam Proses";
      else if (t.status === "Dalam Proses") t.status = "Selesai";
      else t.status = "Open";
    }
    return t;
  });
  saveTickets();
}

// Hapus Tiket
function deleteTicket(id) {
  if (confirm("Apakah yakin ingin menghapus tiket ini?")) {
    tickets = tickets.filter(function(t) { return t.id !== id; });
    saveTickets();
  }
}

// Filter dan Pencarian
function filterTickets() {
  var searchValue = document.getElementById("search-input").value.toLowerCase();
  var statusValue = document.getElementById("status-filter").value;

  var filtered = tickets.filter(function(t) {
    var matchSearch = t.reporter.toLowerCase().indexOf(searchValue) !== -1 || 
                        t.description.toLowerCase().indexOf(searchValue) !== -1 ||
                        t.id.toLowerCase().indexOf(searchValue) !== -1;
    var matchStatus = statusValue === "ALL" || t.status === statusValue;
    return matchSearch && matchStatus;
  });

  renderTable(filtered);
}

// Jalankan saat pertama dimuat
renderApp();