// ============================================
// ServerTrack - Frontend logic
// ============================================

// Your API Gateway Invoke URL (no slash at the end)
const API_URL = "https://0s1lnbj0cf.execute-api.us-east-1.amazonaws.com/prod";

// Keep all servers here so search and filter work without calling the API again
let allServers = [];

// Grab page elements
const form = document.getElementById("serverForm");
const tableBody = document.getElementById("serverTable");
const messageBox = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const searchBox = document.getElementById("searchBox");
const statusFilter = document.getElementById("statusFilter");
const refreshBtn = document.getElementById("refreshBtn");

// ---------- Helpers ----------

// Show a green or red message at the top of the dashboard
function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = "message " + type;
  setTimeout(() => messageBox.classList.add("hidden"), 4000);
}

// Stop text from being treated as HTML (security)
function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : value;
  return div.innerHTML;
}

// ---------- READ: get all servers ----------
async function loadServers() {
  tableBody.innerHTML = '<tr><td colspan="8" class="center muted">Loading...</td></tr>';
  try {
    const response = await fetch(API_URL + "/servers");
    const data = await response.json();
    allServers = data.servers || [];

    // Newest first
    allServers.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));

    renderTable();
  } catch (error) {
    console.error(error);
    tableBody.innerHTML = '<tr><td colspan="8" class="center muted">Could not load servers. Check your API URL and CORS.</td></tr>';
    showMessage("Could not reach the API.", "error");
  }
}

// ---------- Draw the table ----------
function renderTable() {
  const search = searchBox.value.toLowerCase();
  const status = statusFilter.value;

  const filtered = allServers.filter((s) => {
    const text = (s.server_name + " " + s.team + " " + s.ip_address).toLowerCase();
    return text.includes(search) && (status === "" || s.status === status);
  });

  updateStats();

  if (filtered.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8" class="center muted">No servers found.</td></tr>';
    return;
  }

  tableBody.innerHTML = filtered.map((s) => `
    <tr>
      <td>${escapeHTML(s.server_name)}</td>
      <td>${escapeHTML(s.environment)}</td>
      <td>${escapeHTML(s.instance_type)}</td>
      <td>${escapeHTML(s.ip_address)}</td>
      <td>${escapeHTML(s.region)}</td>
      <td>${escapeHTML(s.team)}</td>
      <td><span class="badge ${escapeHTML(s.status)}">${escapeHTML(s.status)}</span></td>
      <td>
        <button class="action-btn edit" onclick="editServer('${escapeHTML(s.server_id)}')">Edit</button>
        <button class="action-btn delete" onclick="deleteServer('${escapeHTML(s.server_id)}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

// ---------- Update the three number boxes ----------
function updateStats() {
  document.getElementById("statTotal").textContent = allServers.length;
  document.getElementById("statRunning").textContent = allServers.filter((s) => s.status === "running").length;
  document.getElementById("statStopped").textContent = allServers.filter((s) => s.status === "stopped").length;
}

// ---------- CREATE or UPDATE (form submit) ----------
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // stop the page from reloading

  const serverId = document.getElementById("serverId").value;

  const serverData = {
    server_name: document.getElementById("server_name").value.trim(),
    environment: document.getElementById("environment").value,
    instance_type: document.getElementById("instance_type").value.trim(),
    ip_address: document.getElementById("ip_address").value.trim(),
    region: document.getElementById("region").value.trim(),
    team: document.getElementById("team").value.trim(),
    status: document.getElementById("status").value,
  };

  // If serverId has a value we are editing (PUT), otherwise adding (POST)
  const isEditing = serverId !== "";
  const url = isEditing ? `${API_URL}/servers/${serverId}` : `${API_URL}/servers`;
  const method = isEditing ? "PUT" : "POST";

  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";

  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serverData),
    });
    const result = await response.json();

    if (response.ok) {
      showMessage(isEditing ? "Server updated." : "Server added.", "success");
      resetForm();
      loadServers();
    } else {
      showMessage(result.message || "Something went wrong.", "error");
    }
  } catch (error) {
    console.error(error);
    showMessage("Could not reach the API.", "error");
  }

  submitBtn.disabled = false;
  submitBtn.textContent = isEditing ? "Update server" : "Add server";
});

// ---------- Edit: fill the form with the server's details ----------
function editServer(id) {
  const s = allServers.find((item) => item.server_id === id);
  if (!s) return;

  document.getElementById("serverId").value = s.server_id;
  document.getElementById("server_name").value = s.server_name;
  document.getElementById("environment").value = s.environment;
  document.getElementById("instance_type").value = s.instance_type;
  document.getElementById("ip_address").value = s.ip_address;
  document.getElementById("region").value = s.region;
  document.getElementById("team").value = s.team;
  document.getElementById("status").value = s.status;

  formTitle.textContent = "Edit server";
  submitBtn.textContent = "Update server";
  cancelBtn.classList.remove("hidden");
  form.scrollIntoView({ behavior: "smooth" });
}

// ---------- DELETE ----------
async function deleteServer(id) {
  if (!confirm("Delete this server record?")) return;

  try {
    const response = await fetch(`${API_URL}/servers/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (response.ok) {
      showMessage("Server deleted.", "success");
      loadServers();
    } else {
      showMessage(result.message || "Could not delete.", "error");
    }
  } catch (error) {
    console.error(error);
    showMessage("Could not reach the API.", "error");
  }
}

// ---------- Put the form back to "add" mode ----------
function resetForm() {
  form.reset();
  document.getElementById("serverId").value = "";
  formTitle.textContent = "Add a new server";
  submitBtn.textContent = "Add server";
  cancelBtn.classList.add("hidden");
}

// ---------- Button and filter events ----------
cancelBtn.addEventListener("click", resetForm);
refreshBtn.addEventListener("click", loadServers);
searchBox.addEventListener("input", renderTable);
statusFilter.addEventListener("change", renderTable);

// Load the servers when the page opens
loadServers();
