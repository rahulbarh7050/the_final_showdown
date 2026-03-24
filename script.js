// MOBILE NAV
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburgerBtn');
  const isOpen = nav.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
}

function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('hamburgerBtn').classList.remove('open');
}

// COUNTDOWN
function updateCountdown() {
  const target = new Date('2025-04-11T09:00:00');
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent = '00';
    document.getElementById('cd-secs').textContent = '00';
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// FORM STORAGE
const registrations = [];

function submitForm() {
  const teamName = document.getElementById('teamName').value.trim();
  const leaderName = document.getElementById('leaderName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const college = document.getElementById('college').value.trim();
  const teamSize = document.getElementById('teamSize').value;
  const events = [...document.querySelectorAll('input[name="events"]:checked')].map(e => e.value);
  const notes = document.getElementById('notes').value.trim();
  const err = document.getElementById('form-error');

  if (!teamName || !leaderName || !email || !phone || !college || !teamSize) {
    err.style.display = 'block';
    err.textContent = '⚠ Please fill in all required fields';
    return;
  }
  if (events.length === 0) {
    err.style.display = 'block';
    err.textContent = '⚠ Select at least one event to register';
    return;
  }
  err.style.display = 'none';

  const regId = 'TFS-' + Date.now().toString(36).toUpperCase();
  const entry = { regId, teamName, leaderName, email, phone, college, teamSize, events, notes, timestamp: new Date().toISOString() };
  registrations.push(entry);

  // Store in localStorage for persistence
  const stored = JSON.parse(localStorage.getItem('tfs_registrations') || '[]');
  stored.push(entry);
  localStorage.setItem('tfs_registrations', JSON.stringify(stored));

  document.getElementById('form-area').style.display = 'none';
  document.getElementById('regIdDisplay').textContent = 'REG ID: ' + regId;
  document.getElementById('successMsg').classList.add('show');
}

function resetForm() {
  document.getElementById('teamName').value = '';
  document.getElementById('leaderName').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('college').value = '';
  document.getElementById('teamSize').value = '';
  document.getElementById('notes').value = '';
  document.querySelectorAll('input[name="events"]').forEach(e => e.checked = false);
  document.getElementById('form-area').style.display = 'block';
  document.getElementById('successMsg').classList.remove('show');
}

// Expose for coordinator to view all registrations via console
window.getRegistrations = function () {
  const stored = JSON.parse(localStorage.getItem('tfs_registrations') || '[]');
  console.table(stored);
  return stored;
};

window.exportCSV = function () {
  const stored = JSON.parse(localStorage.getItem('tfs_registrations') || '[]');
  if (!stored.length) { alert('No registrations yet!'); return; }
  const headers = ['Reg ID', 'Team Name', 'Leader', 'Email', 'Phone', 'College', 'Team Size', 'Events', 'Notes', 'Timestamp'];
  const rows = stored.map(r => [r.regId, r.teamName, r.leaderName, r.email, r.phone, r.college, r.teamSize, r.events.join(' | '), r.notes, r.timestamp]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'TFS_Registrations.csv';
  a.click();
};
