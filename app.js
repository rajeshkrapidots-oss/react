const app = document.getElementById('app');

const ROUTES = {
  LOGIN: '#/login',
  DASHBOARD: '#/',
  USERS: '#/users',
  ACTIVITY: '#/activity-blocks',
  DEVICES: '#/devices',
  SCREENSHOTS: '#/screenshots',
  ANALYTICS: '#/analytics',
  SETTINGS: '#/settings'
};

const navItemsMain = [
  [ROUTES.DASHBOARD, 'Dashboard', 'layout-dashboard'],
  [ROUTES.USERS, 'Users', 'users'],
  [ROUTES.ACTIVITY, 'Activity Blocks', 'blocks'],
  [ROUTES.DEVICES, 'Devices', 'monitor'],
  [ROUTES.SCREENSHOTS, 'Screenshots', 'image']
];

const navItemsSystem = [
  [ROUTES.ANALYTICS, 'Analytics', 'bar-chart-3'],
  [ROUTES.SETTINGS, 'Settings', 'settings']
];

const data = {
  dashboard: {
    stats: [
      { label: 'Total Users', value: '2,847', change: '+12.5%', up: true, icon: 'users' },
      { label: 'Active Today', value: '1,423', change: '+8.1%', up: true, icon: 'user-check' },
      { label: 'Activity Blocks', value: '18,392', change: '+23.4%', up: true, icon: 'blocks' },
      { label: 'Productivity', value: '87.2%', change: '-1.3%', up: false, icon: 'target' }
    ],
    trendDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    blocks: [320, 480, 410, 560, 490, 180, 120],
    sessions: [48, 62, 55, 71, 64, 22, 15],
    appNames: ['VS Code', 'Chrome', 'Slack', 'Figma', 'Terminal', 'Notion'],
    appUsage: [245, 198, 142, 98, 87, 65],
    hours: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
    keyboard: [420, 580, 610, 290, 380, 540, 620, 510, 380],
    mouse: [280, 390, 420, 180, 260, 370, 440, 350, 240],
    recent: [
      ['SC', 'Sarah Chen', 'VS Code', '09:15 AM', '10:42 AM', 94, 'active'],
      ['MJ', 'Marcus Johnson', 'Chrome', '09:30 AM', '11:15 AM', 87, 'active'],
      ['AT', 'Aiko Tanaka', 'Figma', '10:00 AM', '10:45 AM', 76, 'idle'],
      ['JW', 'James Wilson', 'Slack', '08:45 AM', '09:30 AM', 91, 'active'],
      ['PS', 'Priya Sharma', 'Terminal', '10:20 AM', '11:00 AM', 98, 'active'],
      ['LO', "Liam O'Brien", 'Notion', '09:50 AM', '10:15 AM', 62, 'away']
    ]
  },
  users: [
    ['1', 'SC', 'sarah.chen', 'sarah@company.com', true, true, '2026-02-13T09:15:00Z'],
    ['2', 'MJ', 'marcus.j', 'marcus@company.com', true, false, '2026-02-13T08:42:00Z'],
    ['3', 'AT', 'aiko.tanaka', 'aiko@company.com', false, false, '2026-02-10T14:30:00Z'],
    ['4', 'JW', 'james.wilson', 'james@company.com', true, true, '2026-02-13T07:55:00Z'],
    ['5', 'PS', 'priya.sharma', 'priya@company.com', true, false, '2026-02-12T16:20:00Z'],
    ['6', 'LO', 'liam.obrien', 'liam@company.com', false, false, '2026-02-08T11:00:00Z'],
    ['7', 'ED', 'emily.davis', 'emily@company.com', true, true, '2026-02-13T10:05:00Z'],
    ['8', 'OK', 'omar.khan', 'omar@company.com', true, false, '2026-02-13T06:30:00Z']
  ],
  activityBlocks: [
    ['1', 'sarah.chen', 'MacBook Pro', 'VS Code', '09:00', '09:45', 94, 1240, 540, 0],
    ['2', 'marcus.j', 'Windows 11', 'Chrome', '10:00', '10:20', 76, 320, 210, 120],
    ['3', 'priya.sharma', 'MacBook Air', 'Figma', '11:00', '12:00', 88, 820, 610, 30],
    ['4', 'james.wilson', 'Ubuntu', 'Slack', '12:15', '12:45', 65, 120, 80, 200],
    ['5', 'omar.khan', 'Windows 10', 'Excel', '14:00', '15:00', 92, 1040, 430, 0]
  ],
  devices: [
    ['MacBook Pro 14”', 'sarah.chen', 'macOS Sonoma', '2026-02-13T10:12:00Z', 'Online'],
    ['Office-PC-01', 'marcus.j', 'Windows 11', '2026-02-13T09:42:00Z', 'Idle'],
    ['Ubuntu-Dev', 'alex.petrov', 'Ubuntu 22.04', '2026-02-12T18:20:00Z', 'Offline'],
    ['Mac Studio', 'emily.davis', 'macOS Sonoma', '2026-02-13T08:55:00Z', 'Online']
  ],
  screenshots: [
    ['https://picsum.photos/640/380?1', 'sarah.chen', 'VS Code', '2026-02-13T09:12:00Z', 94],
    ['https://picsum.photos/640/380?2', 'marcus.j', 'Chrome', '2026-02-13T10:05:00Z', 76],
    ['https://picsum.photos/640/380?3', 'priya.sharma', 'Figma', '2026-02-12T14:22:00Z', 88],
    ['https://picsum.photos/640/380?4', 'alex.petrov', 'Slack', '2026-02-12T11:10:00Z', 69]
  ]
};

const pageCharts = [];
const destroyCharts = () => { while (pageCharts.length) pageCharts.pop().destroy(); };
const confidenceClass = (c) => c >= 90 ? 'success' : c >= 70 ? 'warning' : 'danger';
const statusClass = (s) => ({ Active: 'active', Idle: 'idle', Away: 'away', Online: 'active', Offline: 'away' }[s] || 'idle');
const fmtDate = (iso) => new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const navSection = (items, current) => items.map(([path, label, icon]) => `
  <a href="${path}" class="nav-link ${current === path ? 'active' : ''}">
    <i data-lucide="${icon}"></i><span>${label}</span>
  </a>`).join('');

const layout = (current, content) => `
<div class="app-shell">
  <aside class="sidebar">
    <div class="brand"><div class="logo-pill"><i data-lucide="zap"></i></div><div><strong>AdminHub</strong><small>Enterprise Suite</small></div></div>
    <div class="nav-section"><div class="nav-title">MAIN</div>${navSection(navItemsMain, current)}</div>
    <div class="nav-section"><div class="nav-title">SYSTEM</div>${navSection(navItemsSystem, current)}
      <a href="#/login" id="logout-link" class="nav-link"><i data-lucide="log-out"></i><span>Log out</span></a>
    </div>
  </aside>
  <main class="main">
    <header class="topbar"><div class="search"><i data-lucide="search"></i><input placeholder="Search users, apps, activity..." /></div><div class="muted">${new Date().toLocaleDateString()}</div></header>
    <section class="content">${content}</section>
  </main>
</div>`;

function pageDashboard() {
  const d = data.dashboard;
  return `
  <div class="header-row"><div><h1>Dashboard</h1><p class="muted">Real-time workforce analytics overview</p></div><div class="muted">Last updated: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div></div>
  <div class="stats">${d.stats.map(s => `<div class="card"><div class="stat-top"><div class="stat-label">${s.label}</div><i data-lucide="${s.icon}"></i></div><div class="stat-value">${s.value}</div><div class="change ${s.up ? 'success':'danger'}">${s.change}</div></div>`).join('')}</div>
  <div class="charts-1"><div class="card"><h3>Activity Trend</h3><p class="muted">Blocks & sessions this week</p><div class="chart-wrap"><canvas id="d-line"></canvas></div></div><div class="card"><h3>App Usage</h3><p class="muted">Top apps by minutes</p><div class="chart-wrap"><canvas id="d-bar"></canvas></div></div></div>
  <div class="charts-2"><div class="card"><h3>Time Distribution</h3><p class="muted">Active vs Idle vs Away</p><div class="chart-wrap small"><canvas id="d-pie"></canvas></div></div><div class="card"><h3>Input Activity</h3><p class="muted">Keyboard & mouse events per hour</p><div class="chart-wrap small"><canvas id="d-area"></canvas></div></div></div>
  <div class="card table-wrap"><h3>Recent Activity</h3><p class="muted">Latest tracked sessions across your team</p>
    <table class="table"><thead><tr><th>User</th><th>App</th><th>Start</th><th>End</th><th>Confidence</th><th>Status</th></tr></thead><tbody>
      ${d.recent.map(r=>`<tr><td><div class="usercell"><span class="avatar">${r[0]}</span>${r[1]}</div></td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td><span class="badge ${confidenceClass(r[5])}">${r[5]}%</span></td><td><span class="badge ${statusClass(r[6][0].toUpperCase()+r[6].slice(1))}">${r[6]}</span></td></tr>`).join('')}
    </tbody></table></div>`;
}

function pageUsers() {
  return `<div class="header-row"><div><h1>Users</h1><p class="muted">Manage and monitor all users in your organization</p></div><div class="muted">${data.users.length} total users</div></div>
  <div class="card table-wrap"><table class="table"><thead><tr><th>User</th><th>Email</th><th>Active</th><th>Staff</th><th>Last Login</th><th>Work Diary</th></tr></thead><tbody>
  ${data.users.map(u=>`<tr><td><div class="usercell"><span class="avatar">${u[1]}</span>${u[2]}</div></td><td>${u[3]}</td><td><span class="badge ${u[4] ? 'active':'away'}">${u[4] ? 'Active':'Inactive'}</span></td><td><span class="badge ${u[5] ? 'active':'idle'}">${u[5] ? 'Staff':'Member'}</span></td><td>${fmtDate(u[6])}</td><td><a href="#/users/${u[0]}/work-diary" class="link-btn">View diary</a></td></tr>`).join('')}
  </tbody></table></div>`;
}

function pageUserDiary(id) {
  const user = data.users.find(u => u[0] === id) || data.users[0];
  const activity = [
    ['VS Code', '09:00', '10:15', 94, 'Active'],
    ['Chrome', '10:15', '10:40', 68, 'Idle'],
    ['Figma', '10:45', '12:30', 88, 'Active'],
    ['Slack', '01:00', '01:30', 72, 'Away']
  ];
  return `<div class="header-row"><div><h1>User Work Diary</h1><p class="muted">${user[2]} · ${user[3]}</p></div><a href="#/users" class="link-btn">Back to users</a></div>
  <div class="charts-2"><div class="card"><h3>Daily Activity Trend</h3><div class="chart-wrap small"><canvas id="wd-trend"></canvas></div></div><div class="card"><h3>Idle vs Work</h3><div class="chart-wrap small"><canvas id="wd-pie"></canvas></div></div></div>
  <div class="card table-wrap"><table class="table"><thead><tr><th>App</th><th>Start</th><th>End</th><th>Confidence</th><th>Status</th></tr></thead><tbody>
  ${activity.map(a=>`<tr><td>${a[0]}</td><td>${a[1]}</td><td>${a[2]}</td><td><span class="badge ${confidenceClass(a[3])}">${a[3]}%</span></td><td><span class="badge ${statusClass(a[4])}">${a[4]}</span></td></tr>`).join('')}
  </tbody></table></div>`;
}

function pageActivityBlocks() {
  return `<div class="header-row"><div><h1>Activity Blocks</h1><p class="muted">Detailed tracked blocks with confidence and input stats</p></div></div>
  <div class="card table-wrap"><table class="table"><thead><tr><th>User</th><th>Device</th><th>App</th><th>Time</th><th>Confidence</th><th>Keys</th><th>Mouse</th><th>Idle</th></tr></thead><tbody>
  ${data.activityBlocks.map(b=>`<tr><td>${b[1]}</td><td>${b[2]}</td><td>${b[3]}</td><td>${b[4]} - ${b[5]}</td><td><span class="badge ${confidenceClass(b[6])}">${b[6]}%</span></td><td>${b[7]}</td><td>${b[8]}</td><td>${b[9]}s</td></tr>`).join('')}
  </tbody></table></div>`;
}

function pageDevices() {
  return `<div class="header-row"><div><h1>Devices</h1><p class="muted">Connected devices and real-time status</p></div><div class="muted">${data.devices.length} devices</div></div>
  <div class="card table-wrap"><table class="table"><thead><tr><th>Device</th><th>User</th><th>OS</th><th>Last Active</th><th>Status</th></tr></thead><tbody>
  ${data.devices.map(d=>`<tr><td>${d[0]}</td><td>${d[1]}</td><td>${d[2]}</td><td>${fmtDate(d[3])}</td><td><span class="badge ${statusClass(d[4])}">${d[4]}</span></td></tr>`).join('')}
  </tbody></table></div>`;
}

function pageScreenshots() {
  return `<div class="header-row"><div><h1>Screenshots</h1><p class="muted">Latest captures with confidence scoring</p></div></div>
  <div class="shot-grid">${data.screenshots.map(s=>`<article class="shot-card"><img src="${s[0]}" alt="screenshot"/><div class="shot-meta"><div><strong>${s[1]}</strong><p class="muted">${s[2]} · ${fmtDate(s[3])}</p></div><span class="badge ${confidenceClass(s[4])}">${s[4]}%</span></div></article>`).join('')}</div>`;
}

function pageAnalytics() {
  return `<div class="header-row"><div><h1>Analytics</h1><p class="muted">Aggregate productivity patterns and trends</p></div></div>
  <div class="charts-1"><div class="card"><h3>Activity Trend</h3><div class="chart-wrap"><canvas id="a-line"></canvas></div></div><div class="card"><h3>User Productivity</h3><div class="chart-wrap"><canvas id="a-bar"></canvas></div></div></div>
  <div class="charts-2"><div class="card"><h3>Idle Distribution</h3><div class="chart-wrap small"><canvas id="a-pie"></canvas></div></div><div class="card"><h3>App Usage Stack</h3><div class="chart-wrap small"><canvas id="a-stack"></canvas></div></div></div>`;
}

function pageSettings() {
  return `<div class="header-row"><div><h1>Settings</h1><p class="muted">Configuration and system preferences</p></div></div>
  <div class="settings-grid">
    <div class="card"><h3>Theme</h3><div class="form-row"><label><input type="radio" name="theme" checked/> Light</label><label><input type="radio" name="theme"/> Dark</label></div></div>
    <div class="card"><h3>Notifications</h3><div class="form-row col"><label><input type="checkbox" checked/> Email alerts</label><label><input type="checkbox" checked/> Weekly report</label><label><input type="checkbox"/> Push events</label></div></div>
    <div class="card"><h3>Tracking</h3><div class="form-row col"><label><input type="checkbox" checked/> Enable screenshot capture</label><label><input type="checkbox" checked/> Enable keyboard/mouse monitoring</label></div></div>
    <div class="card"><h3>Danger Zone</h3><button class="danger-btn">Reset Demo Data</button></div>
  </div>`;
}

function pageNotFound() {
  return `<div class="center-card"><h1>404</h1><p class="muted">Oops! Page not found</p><a href="#/" class="link-btn">Return to Home</a></div>`;
}

function commonChartOpts() {
  return { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { usePointStyle: true, boxWidth: 8 } } } };
}

function buildPageCharts(hash) {
  if (!window.Chart) return;
  const common = commonChartOpts();
  const d = data.dashboard;

  if (hash === ROUTES.DASHBOARD) {
    pageCharts.push(new Chart(document.getElementById('d-line'), { type: 'line', data: { labels: d.trendDays, datasets: [{ label: 'Blocks', data: d.blocks, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,.15)', fill: true, tension: .35 }, { label: 'Sessions', data: d.sessions, borderColor: '#16a34a', borderDash: [5, 5], tension: .35 }] }, options: common }));
    pageCharts.push(new Chart(document.getElementById('d-bar'), { type: 'bar', data: { labels: d.appNames, datasets: [{ label: 'Minutes', data: d.appUsage, backgroundColor: ['#2563eb','#3b82f6','#60a5fa','#8b5cf6','#a78bfa','#c4b5fd'] }] }, options: { ...common, indexAxis: 'y', plugins: { legend: { display: false } } } }));
    pageCharts.push(new Chart(document.getElementById('d-pie'), { type: 'doughnut', data: { labels: ['Active','Idle','Away'], datasets: [{ data: [72,18,10], backgroundColor: ['#16a34a','#d97706','#94a3b8'], borderWidth: 0 }] }, options: { ...common, cutout: '60%' } }));
    pageCharts.push(new Chart(document.getElementById('d-area'), { type: 'line', data: { labels: d.hours, datasets: [{ label: 'Keyboard', data: d.keyboard, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,.2)', fill: true, tension: .35 }, { label: 'Mouse', data: d.mouse, borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,.16)', fill: true, tension: .35 }] }, options: common }));
  }

  if (hash === ROUTES.ANALYTICS) {
    pageCharts.push(new Chart(document.getElementById('a-line'), { type: 'line', data: { labels: ['Mon','Tue','Wed','Thu','Fri'], datasets: [{ label: 'Blocks', data: [32,45,38,51,48], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,.18)', fill: true, tension: .35 }] }, options: common }));
    pageCharts.push(new Chart(document.getElementById('a-bar'), { type: 'bar', data: { labels: ['Sarah','Marcus','Priya','Alex'], datasets: [{ label: 'Productivity', data: [92,74,88,69], backgroundColor: ['#16a34a','#f59e0b','#2563eb','#ef4444'] }] }, options: { ...common, plugins: { legend: { display: false } } } }));
    pageCharts.push(new Chart(document.getElementById('a-pie'), { type: 'doughnut', data: { labels: ['Work','Idle','Away'], datasets: [{ data: [68,22,10], backgroundColor: ['#16a34a','#d97706','#94a3b8'], borderWidth: 0 }] }, options: { ...common, cutout: '58%' } }));
    pageCharts.push(new Chart(document.getElementById('a-stack'), { type: 'bar', data: { labels: ['Mon','Tue','Wed','Thu','Fri'], datasets: [{ label: 'Chrome', data: [3,4,2,5,3], backgroundColor: '#60a5fa' }, { label: 'VS Code', data: [5,6,4,3,7], backgroundColor: '#2563eb' }, { label: 'Figma', data: [2,1,3,2,1], backgroundColor: '#8b5cf6' }] }, options: { ...common, scales: { x: { stacked: true }, y: { stacked: true } } } }));
  }

  if (hash.startsWith('#/users/') && hash.endsWith('/work-diary')) {
    pageCharts.push(new Chart(document.getElementById('wd-trend'), { type: 'line', data: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ label: 'Blocks', data: [22,28,19,30,26,12,8], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,.2)', fill: true, tension: .35 }] }, options: common }));
    pageCharts.push(new Chart(document.getElementById('wd-pie'), { type: 'doughnut', data: { labels: ['Active','Idle','Away'], datasets: [{ data: [68,22,10], backgroundColor: ['#16a34a','#d97706','#94a3b8'] }] }, options: { ...common, cutout: '58%' } }));
  }
}

function renderLogin() {
  app.innerHTML = `
  <div class="login-gradient"><form class="login-card" id="login-form">
    <div class="logo-pill"><i data-lucide="zap"></i></div>
    <h2>Welcome back</h2><p class="sub">Sign in to your account</p>
    <div class="form-group"><label>Email</label><input id="email" type="email" placeholder="you@company.com" required></div>
    <div class="form-group"><label>Password</label><input id="password" type="password" placeholder="••••••••" required></div>
    <button class="primary" type="submit">Sign in</button><p class="notice" id="notice"></p>
  </form></div>`;

  hydrateIcons();
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (email === 'admin@tracker.io' && password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      window.location.hash = ROUTES.DASHBOARD;
    } else {
      document.getElementById('notice').textContent = 'Use admin@tracker.io / admin123';
    }
  });
}

function hydrateIcons() {
  if (window.lucide?.createIcons) window.lucide.createIcons({ attrs: { width: 17, height: 17 } });
}

function renderAuthedPage(hash) {
  let content = '';
  if (hash === ROUTES.DASHBOARD) content = pageDashboard();
  else if (hash === ROUTES.USERS) content = pageUsers();
  else if (hash.startsWith('#/users/') && hash.endsWith('/work-diary')) content = pageUserDiary(hash.split('/')[2]);
  else if (hash === ROUTES.ACTIVITY) content = pageActivityBlocks();
  else if (hash === ROUTES.DEVICES) content = pageDevices();
  else if (hash === ROUTES.SCREENSHOTS) content = pageScreenshots();
  else if (hash === ROUTES.ANALYTICS) content = pageAnalytics();
  else if (hash === ROUTES.SETTINGS) content = pageSettings();
  else content = pageNotFound();

  app.innerHTML = layout(hash, content);
  hydrateIcons();
  buildPageCharts(hash);

  const logout = document.getElementById('logout-link');
  if (logout) logout.addEventListener('click', () => localStorage.clear());
}

function render() {
  const hash = window.location.hash || ROUTES.LOGIN;
  const authed = localStorage.getItem('isAuthenticated') === 'true';
  destroyCharts();

  if (hash === ROUTES.LOGIN) return renderLogin();
  if (!authed) {
    window.location.hash = ROUTES.LOGIN;
    return;
  }
  renderAuthedPage(hash);
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);
