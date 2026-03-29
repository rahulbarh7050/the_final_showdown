// =============================================
// ⚙️ GOOGLE SHEETS CONFIG
// Paste your deployed Apps Script URL below
// =============================================
const SHEET_URL = 'YOUR_APPS_SCRIPT_URL_HERE';

// =============================================
// EVENT DATA — Real coordinator names updated
// =============================================
const EVENT_DATA = {
  'line-follower': {
    num: 'EVENT 01', icon: '🤖', name: 'Line Follower',
    type: 'auto', typeLabel: 'Autonomous',
    desc: 'Navigate a complex track at maximum speed following only a line. Your bot must use sensors to detect and follow a predefined path through curves, intersections, and speed bumps. The fastest bot with the cleanest run wins. Multiple heats will determine finalists.',
    stats: [{ val: '2–5', key: 'Team Size' }, { val: 'ESP8266', key: '1st Prize' }, { val: 'Colour sensor', key: '2nd Prize' }],
    coordinators: [
      { name: 'Vineet Jogi', contact: '+91 9076142724', img: 'images/vineet.jpg' },
      { name: 'Gaurav Yadav', contact: '+91 9236479543', img: 'images/gaurav.jpg' }
    ],
    rulebook: 'rulebooks/linefollower.pdf'
  },
  'fire-fighter': {
    num: 'EVENT 02', icon: '🔥', name: 'Fire Fighter',
    type: 'auto', typeLabel: 'Autonomous',
    desc: 'Your bot must autonomously navigate a maze, detect a live flame using sensors, and extinguish it — all without any human control. You may use any combination of flame sensors, ultrasonic sensors, and extinguishing mechanisms. Speed and accuracy both count toward scoring.',
    stats: [{ val: '2–5', key: 'Team Size' }, { val: 'Arduino Nano', key: '1st Prize' }, { val: 'PIR Sensor', key: '2nd Prize' }],
    coordinators: [
      { name: 'Rahul Kumar', contact: '+91 7050472750', img: 'images/rahul.jpg' },
      { name: 'Shivangi Jha', contact: '+91 9149084945', img: 'images/shivangi.jpg' }
    ],
    rulebook: 'rulebooks/firefighter.pdf'
  },
  'deathrace': {
    num: 'EVENT 03', icon: '🏎️', name: 'DeathRace',
    type: 'manual', typeLabel: 'Manual — Car Race',
    desc: 'High-speed RC car racing on a rugged obstacle track. Multiple laps, timed runs, and elimination heats. Your car must survive the track — collisions, flips, and breakdown are common. Fastest cumulative lap time across clean runs decides the winner.',
    stats: [{ val: '2-5', key: 'Team Size' }, { val: 'ESP32', key: '1st Prize' }, { val: 'Gas Sensor Module', key: '2nd Prize' }],
    coordinators: [
      { name: 'Shivangi Jha', contact: '+91 9149084945', img: 'images/shivangi.jpg' },
      { name: 'Pushpika Patel', contact: '+91 8318575758', img: 'images/pushpika.jpg' }
    ],
    rulebook: 'rulebooks/deathrace.pdf'
  },
  'soccer-bot': {
    num: 'EVENT 04', icon: '⚽', name: 'Robo-Soccer',
    type: 'manual', typeLabel: 'Manual — Soccer',
    desc: 'Two teams of RC bots face off in a head-to-head soccer match. League rounds followed by knockouts determine the champion. Bots must stay within dimensional limits. Strategy and control precision decide who wins.',
    stats: [{ val: '2–5', key: 'Team Size' }, { val: 'MPU6050+BMP280', key: '1st Prize' }, { val: 'MQ-2 GAS SENSOR', key: '2nd Prize' }],
    coordinators: [
      { name: 'Gaurav Yadav', contact: '+91 9236479543', img: 'images/gaurav.jpg' },
      { name: 'Vineet Jogi', contact: '+91 9076142724', img: 'images/vineet.jpg' }
    ],
    rulebook: 'rulebooks/robosoccer.pdf'
  },
  'robo-rumble': {
    num: 'EVENT 05', icon: '💪', name: 'Robo-Rumble',
    type: 'manual', typeLabel: 'Manual — Combat',
    desc: 'The most ferocious event of the arena. Robo-Rumble is a 3-part combat challenge: (1) Tug of War — two bots pull against each other on a rope, (2) Sub-Event 1, and (3) Sub-Event 2. Your bot must be built to withstand punishment.',
    stats: [{ val: '2–5', key: 'Team Size' }, { val: 'not decided', key: '1st Prize' }, { val: 'Ultrasonic Sensor', key: '2nd Prize' }],
    coordinators: [
      { name: 'Anamika Roy', contact: '+91 8147021850', img: 'images/anamika.jpg' },
      { name: 'Rahul Kumar', contact: '+91 7050472750', img: 'images/rahul.jpg' }
    ],
    rulebook: 'rulebooks/roborumble.pdf'
  },
  'hovercraft': {
    num: 'EVENT 06', icon: '🛸', name: 'Hovercraft',
    type: 'manual', typeLabel: 'Manual — RC',
    desc: 'Pilot a custom-built RC hovercraft through a challenging course. Your hovercraft must be self-built within specified dimensions and weight limits. The course includes turns, ramps, and surface changes. Master the unique air-cushion physics — speed and precision wins.',
    stats: [{ val: '2–4', key: 'Team Size' }, { val: 'not decided', key: '1st Prize' }, { val: 'not decided', key: '2nd Prize' }],
    coordinators: [
      { name: 'Pushpika Patel', contact: '+91 8318575758', img: 'images/pushpika.jpg' },
      { name: 'Anchal Chaudhary', contact: '+91 9336049348', img: 'images/anchal.jpg' }
    ],
    rulebook: 'rulebooks/hovercraft.pdf'
  }
};

// All 6 events for "also joining" checkboxes
const ALL_EVENTS = [
  { value: 'Line Follower',  tag: 'AUTONOMOUS' },
  { value: 'Fire Fighter',   tag: 'AUTONOMOUS' },
  { value: 'DeathRace',      tag: 'MANUAL' },
  { value: 'Soccer Bot',     tag: 'MANUAL' },
  { value: 'Robo-Rumble',    tag: 'MANUAL — COMBAT' },
  { value: 'Hovercraft',     tag: 'MANUAL — RC' },
];

let currentEventName = '';

// =============================================
// MOBILE NAV
// =============================================
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

// =============================================
// COUNTDOWN — pinned to IST (UTC+5:30)
// =============================================
function updateCountdown() {
  const target = new Date('2026-04-11T17:00:00+10:00');
  const diff = target - new Date();
  if (diff <= 0) {
    ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  document.getElementById('cd-days').textContent  = String(Math.floor(diff / 86400000)).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0');
  document.getElementById('cd-mins').textContent  = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
  document.getElementById('cd-secs').textContent  = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// =============================================
// EVENT MODAL — Open info panel
// =============================================
function openEventModal(eventId) {
  const data = EVENT_DATA[eventId];
  if (!data) return;
  currentEventName = data.name;

  document.getElementById('modalNum').textContent   = data.num;
  document.getElementById('modalIcon').textContent  = data.icon;
  document.getElementById('modalTitle').textContent = data.name;

  const typeEl = document.getElementById('modalType');
  typeEl.textContent = data.typeLabel;
  typeEl.className = 'modal-type ' + data.type;

  document.getElementById('modalDesc').textContent = data.desc;

  document.getElementById('modalStats').innerHTML = data.stats.map(s => `
    <div class="modal-stat">
      <span class="modal-stat-val">${s.val}</span>
      <span class="modal-stat-key">${s.key}</span>
    </div>`).join('');

  document.getElementById('modalCoordinators').innerHTML = data.coordinators.map(c => `
    <div class="coordinator-card">
      <div class="coord-avatar">
        ${c.img ? `<img src="${c.img}" alt="${c.name}" onerror="this.style.display='none'">` : '👤'}
      </div>
      <div>
        <div class="coord-name">${c.name}</div>
        <div class="coord-contact">${c.contact}</div>
      </div>
    </div>`).join('');

  // Rulebook button
  const ruleBtn = document.getElementById('modalRulebookBtn');
  if (data.rulebook) {
    ruleBtn.classList.remove('coming-soon');
    ruleBtn.onclick = () => window.open(data.rulebook, '_blank');
    ruleBtn.textContent = '📄 View Rulebook';
  } else {
    ruleBtn.classList.add('coming-soon');
    ruleBtn.onclick = () => alert('Rulebook coming soon! Check back closer to the event.');
    ruleBtn.textContent = '📄 Rulebook — Coming Soon';
  }

  hideRegisterPanel(true);
  document.getElementById('eventModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeEventModal(e, force) {
  if (force || (e && e.target === document.getElementById('eventModal'))) {
    document.getElementById('eventModal').classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { hideRegisterPanel(true); resetModalForm(); }, 300);
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeEventModal(null, true);
});

// =============================================
// REGISTER PANEL — Slide in from modal
// =============================================
function showRegisterPanel() {
  document.getElementById('regPanelEventTag').textContent = 'Registering for: ' + currentEventName;

  // Show primary event as locked badge only
  document.getElementById('modalEventsList').innerHTML = `
    <div class="primary-event-badge">
      <span class="lock-icon">🔒</span>${currentEventName}
    </div>`;

  document.getElementById('modalRegisterPanel').classList.add('active');
  document.getElementById('eventModal').querySelector('.modal-body').style.display = 'none';
  document.getElementById('eventModal').querySelector('.modal-box').scrollTop = 0;
}

function hideRegisterPanel(silent) {
  document.getElementById('modalRegisterPanel').classList.remove('active');
  const body = document.getElementById('eventModal').querySelector('.modal-body');
  if (body) body.style.display = '';
}

// =============================================
// PHONE VALIDATION
// =============================================
function sanitizeModalPhone(input) {
  input.value = input.value.replace(/[^0-9]/g, '');
  const hint = document.getElementById('m-phoneHint');
  const len = input.value.length;
  if (len > 0 && len < 10) {
    hint.textContent = `${10 - len} more digit${10 - len > 1 ? 's' : ''} needed`;
    hint.className = 'field-hint';
    input.classList.add('error');
  } else if (len === 10) {
    hint.textContent = '✓ Valid';
    hint.className = 'field-hint ok';
    input.classList.remove('error');
  } else {
    hint.textContent = '';
    hint.className = 'field-hint';
    input.classList.remove('error');
  }
}

// =============================================
// FORM SUBMIT
// =============================================
function showModalError(msg) {
  const err = document.getElementById('modal-form-error');
  err.textContent = '⚠ ' + msg;
  err.style.display = 'block';
}
function clearModalError() {
  const err = document.getElementById('modal-form-error');
  err.textContent = '';
  err.style.display = 'none';
}

async function submitModalForm() {
  clearModalError();

  const teamName   = document.getElementById('m-teamName').value.trim();
  const leaderName = document.getElementById('m-leaderName').value.trim();
  const email      = document.getElementById('m-email').value.trim();
  const phone      = document.getElementById('m-phone').value.trim();
  const college    = document.getElementById('m-college').value.trim();
  const teamSize   = document.getElementById('m-teamSize').value;
  const year       = document.getElementById('m-year').value;
  const notes      = document.getElementById('m-notes').value.trim();
  const extraEvents = [];
  const allEvents   = [currentEventName];

  // Validation
  if (!teamName)             return showModalError('Team name is required');
  if (!leaderName)           return showModalError('Leader name is required');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showModalError('Enter a valid email address');
  if (!phone)                return showModalError('Phone number is required');
  if (phone.length !== 10)   return showModalError('Phone must be exactly 10 digits');
  if (/[^0-9]/.test(phone))  return showModalError('Phone must contain digits only');
  if (!college)              return showModalError('College / Institution is required');
  if (!teamSize)             return showModalError('Please select team size');
  if (!year)                 return showModalError('Please select year of study');

  // Loading state
  const btn = document.getElementById('m-submitBtn');
  document.getElementById('m-submitText').style.display = 'none';
  document.getElementById('m-submitLoader').style.display = 'inline';
  btn.disabled = true;

  const regId = 'TFS-' + Date.now().toString(36).toUpperCase();
  const payload = {
    regId, teamName, leaderName, email, phone,
    college, teamSize, year,
    events: allEvents.join(', '),
    notes,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };

  // Backup to localStorage
  try {
    const stored = JSON.parse(localStorage.getItem('tfs_registrations') || '[]');
    stored.push(payload);
    localStorage.setItem('tfs_registrations', JSON.stringify(stored));
  } catch (_) {}

  // Send to Google Sheets
  try {
    if (SHEET_URL && SHEET_URL !== 'YOUR_APPS_SCRIPT_URL_HERE') {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
  } catch (_) {}

  // Show success
  document.getElementById('modal-form-area').style.display = 'none';
  document.getElementById('modal-regIdDisplay').textContent = 'REG ID: ' + regId;
  document.getElementById('modal-successMsg').classList.add('show');

  btn.disabled = false;
  document.getElementById('m-submitText').style.display = 'inline';
  document.getElementById('m-submitLoader').style.display = 'none';
}

function resetModalForm() {
  ['m-teamName','m-leaderName','m-email','m-phone','m-notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const col = document.getElementById('m-college');
  if (col) col.value = 'INDIAN INSTITUTE OF ENGINEERING SCIENCE AND TECHNOLOGY, SHIBPUR';
  ['m-teamSize','m-year'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const ph = document.getElementById('m-phone');
  if (ph) ph.classList.remove('error');
  const hint = document.getElementById('m-phoneHint');
  if (hint) hint.textContent = '';
  clearModalError();
  const fa = document.getElementById('modal-form-area');
  const sm = document.getElementById('modal-successMsg');
  if (fa) fa.style.display = 'block';
  if (sm) sm.classList.remove('show');
}

// =============================================
// COORDINATOR EXPORT TOOLS
// Open browser console (F12) and type these
// =============================================
window.getRegistrations = function () {
  const d = JSON.parse(localStorage.getItem('tfs_registrations') || '[]');
  console.table(d);
  return d;
};

window.exportCSV = function () {
  const d = JSON.parse(localStorage.getItem('tfs_registrations') || '[]');
  if (!d.length) { alert('No registrations yet!'); return; }
  const h = ['Reg ID','Team Name','Leader','Email','Phone','College','Team Size','Year','Events','Notes','Timestamp'];
  const r = d.map(x => [x.regId,x.teamName,x.leaderName,x.email,x.phone,x.college,x.teamSize,x.year||'',x.events,x.notes,x.timestamp]);
  const csv = [h,...r].map(row => row.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csv);
  a.download = 'TFS_Registrations_' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
};