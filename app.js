import { firebaseConfig } from './firebase-config.js';
import { DEMO_SITES } from './demo-data.js';

const FB_VER = '10.14.1';
const ROLE_LABEL = { admin: 'Адміністратор', editor: 'Редактор', viewer: 'Перегляд' };
const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6', '#64748b'];

/* ================= utils ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ESC[c]);
const safeUrl = u => { try { const x = new URL(String(u || '').trim()); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; } };
const host = u => { try { return new URL(u).host.replace(/^www\./, ''); } catch { return ''; } };
const rid = () => Math.random().toString(36).slice(2, 9);
const norm = s => String(s ?? '').toLowerCase().replace(/[’'ʼ`"«»]/g, '').replace(/ё/g, 'е');
const tokens = q => norm(q).split(/[\s,]+/).filter(Boolean);
const initials = n => (String(n || '?').replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('') || '?').toUpperCase();
const safeColor = c => /^#[0-9a-f]{3,8}$/i.test(c || '') ? c : COLORS[0];
const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return `${n} ${m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c}`; };
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
};

const P = {
  search: '<circle cx="11" cy="11" r="7.5"/><path d="m20.5 20.5-4.2-4.2"/>',
  ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  star: '<path d="M12 2.8l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.36l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93z"/>',
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  copy: '<rect width="13" height="13" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
};
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

/* ================= state ================= */
const S = {
  user: null, role: null, sites: [], loaded: false, edit: false,
  sel: 0, filter: {}, modalDone: null,
};
let DB = null;
let unsubSites = null;
const canEdit = () => S.role === 'admin' || S.role === 'editor';
const isAdmin = () => S.role === 'admin';
const favKey = () => `ah-fav:${S.user?.email}`;
const recKey = () => `ah-recent:${S.user?.email}`;
const getFav = () => LS.get(favKey(), []);
const getRecent = () => LS.get(recKey(), []);
const site = id => S.sites.find(s => s.id === id);
const sortSites = arr => arr.map(s => ({ ...s, sections: Array.isArray(s.sections) ? s.sections : [] }))
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || String(a.name).localeCompare(String(b.name), 'uk'));
const linkCount = s => s.sections.reduce((n, x) => n + (x.links?.length || 0), 0);
const keyOf = (s, sec, l) => `${s.id}/${sec.id}/${l.id}`;
function resolve(key) {
  const [a, b, c] = String(key).split('/');
  const s = site(a); const sec = s?.sections.find(x => x.id === b); const l = sec?.links?.find(x => x.id === c);
  return l ? { site: s, sec, link: l } : null;
}

/* ================= data layer ================= */
const configured = !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId);

async function makeFirebase(cfg) {
  const B = `https://www.gstatic.com/firebasejs/${FB_VER}/`;
  const [{ initializeApp }, A, F] = await Promise.all([
    import(B + 'firebase-app.js'), import(B + 'firebase-auth.js'), import(B + 'firebase-firestore.js'),
  ]);
  const app = initializeApp(cfg);
  const auth = A.getAuth(app);
  auth.languageCode = 'uk';
  // Firestore створюється лише після входу: кеш на диску (IndexedDB) — тільки якщо стоїть «Запам'ятати»,
  // інакше дані живуть лише в пам'яті вкладки й зникають після її закриття.
  let _db = null;
  const db = () => {
    if (_db) return _db;
    const localCache = LS.get('ah-remember', true)
      ? F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() })
      : F.memoryLocalCache();
    try { _db = F.initializeFirestore(app, { localCache }); } catch { _db = F.getFirestore(app); }
    return _db;
  };
  const stamp = data => ({ ...data, updatedAt: Date.now(), updatedBy: S.user.email });
  return {
    mode: 'firebase',
    onAuth: cb => A.onAuthStateChanged(auth, cb),
    async login(email, pass, remember) {
      LS.set('ah-remember', !!remember);
      await A.setPersistence(auth, remember ? A.browserLocalPersistence : A.browserSessionPersistence);
      return A.signInWithEmailAndPassword(auth, email, pass);
    },
    reset: email => A.sendPasswordResetEmail(auth, email),
    async logout() {
      await A.signOut(auth);
      try { await F.terminate(db()); await F.clearIndexedDbPersistence(db()); } catch { /* ignore */ }
      location.reload();
    },
    async getMember(email) {
      const snap = await F.getDoc(F.doc(db(), 'members', email));
      return snap.exists() ? snap.data() : null;
    },
    subscribeSites: (cb, err) => F.onSnapshot(F.collection(db(), 'sites'), q => cb(q.docs.map(d => ({ id: d.id, ...d.data() }))), err),
    saveSite(s) {
      const { id, ...data } = s;
      return F.setDoc(F.doc(db(), 'sites', id), stamp(data));
    },
    // Читає свіжу версію з сервера і застосовує зміну в транзакції — щоб одночасні правки
    // двох редакторів не затирали одна одну. Повертає false, якщо fn скасувала зміну.
    updateSite(id, fn) {
      const ref = F.doc(db(), 'sites', id);
      return F.runTransaction(db(), async tx => {
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error('Сайт уже видалено');
        const [cur] = sortSites([{ id, ...snap.data() }]);
        if (fn(cur) === false) return false;
        const { id: _, ...data } = cur;
        tx.set(ref, stamp(data));
        return true;
      });
    },
    deleteSite: id => F.deleteDoc(F.doc(db(), 'sites', id)),
    async listMembers() { const q = await F.getDocs(F.collection(db(), 'members')); return q.docs.map(d => ({ email: d.id, ...d.data() })); },
    saveMember: (email, data) => F.setDoc(F.doc(db(), 'members', email), data),
    deleteMember: email => F.deleteDoc(F.doc(db(), 'members', email)),
  };
}

function makeDemo() {
  const K = 'ah-demo-sites', KM = 'ah-demo-members', KU = 'ah-demo-user';
  let sites = LS.get(K, null) || structuredClone(DEMO_SITES);
  let members = LS.get(KM, null) || [{ email: 'demo@example.com', role: 'admin', name: 'Демо' }];
  let authCb = () => {}; let subs = [];
  const emit = () => { LS.set(K, sites); subs.forEach(f => f(structuredClone(sites))); };
  return {
    mode: 'demo',
    onAuth(cb) { authCb = cb; const u = LS.get(KU, null); setTimeout(() => cb(u), 0); },
    async login(email) {
      if (!members.some(m => m.email === email.toLowerCase())) members.push({ email: email.toLowerCase(), role: 'admin', name: '' });
      LS.set(KM, members);
      const u = { email: email.toLowerCase() }; LS.set(KU, u); authCb(u);
    },
    async reset() {},
    async logout() { localStorage.removeItem(KU); location.reload(); },
    async getMember(email) { return members.find(m => m.email === email) || null; },
    subscribeSites(cb) { subs.push(cb); setTimeout(() => cb(structuredClone(sites)), 0); return () => { subs = subs.filter(f => f !== cb); }; },
    async saveSite(s) { const i = sites.findIndex(x => x.id === s.id); const v = structuredClone(s); if (i >= 0) sites[i] = v; else sites.push(v); emit(); },
    async updateSite(id, fn) {
      const i = sites.findIndex(x => x.id === id); if (i < 0) throw new Error('Сайт уже видалено');
      const [cur] = sortSites([structuredClone(sites[i])]);
      if (fn(cur) === false) return false;
      sites[i] = cur; emit(); return true;
    },
    async deleteSite(id) { sites = sites.filter(x => x.id !== id); emit(); },
    async listMembers() { return structuredClone(members); },
    async saveMember(email, data) { const i = members.findIndex(m => m.email === email); const v = { email, ...data }; if (i >= 0) members[i] = v; else members.push(v); LS.set(KM, members); },
    async deleteMember(email) { members = members.filter(m => m.email !== email); LS.set(KM, members); },
  };
}

/* ================= theme ================= */
function applyTheme() {
  const t = LS.get('ah-theme', null);
  if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  const dark = t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  $('meta[name="theme-color"]').setAttribute('content', dark ? '#0d1017' : '#f6f7fb');
  return dark;
}
const isDark = () => (LS.get('ah-theme', null) ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';

/* ================= toasts & modals ================= */
function toast(msg, type = 'ok') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `${ic(type === 'err' ? 'x' : 'check')}<span>${esc(msg)}</span>`;
  $('#toasts').appendChild(el);
  setTimeout(() => el.classList.add('out'), type === 'err' ? 5000 : 2200);
  setTimeout(() => el.remove(), type === 'err' ? 5400 : 2600);
}

function openModal(html, done) {
  S.modalDone?.(null);
  $('#modal-root').innerHTML = `<div class="overlay"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;
  document.body.classList.add('modal-open');
  S.modalDone = v => { S.modalDone = null; $('#modal-root').innerHTML = ''; document.body.classList.remove('modal-open'); done(v); };
}

function fieldHtml(f) {
  const id = `f-${f.name}`;
  const common = `id="${id}" name="${f.name}" ${f.required ? 'required' : ''} ${f.placeholder ? `placeholder="${esc(f.placeholder)}"` : ''}`;
  let input;
  if (f.type === 'textarea') input = `<textarea ${common} rows="${f.rows || 3}">${esc(f.value)}</textarea>`;
  else if (f.type === 'select') input = `<select ${common}>${f.options.map(o => `<option value="${esc(o.value)}" ${o.value === f.value ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select>`;
  else if (f.type === 'colors') input = `<div class="swatches">${COLORS.map(c => `<label class="sw" style="--c:${c}"><input type="radio" name="${f.name}" value="${c}" ${c === (f.value || COLORS[0]) ? 'checked' : ''}><span></span></label>`).join('')}</div>`;
  else input = `<input type="${f.type || 'text'}" ${common} value="${esc(f.value)}" ${f.type === 'url' ? 'inputmode="url" autocomplete="off"' : ''} ${f.max ? `maxlength="${f.max}"` : ''}>`;
  return `<label class="field ${f.half ? 'half' : ''}" for="${id}"><span class="f-label">${esc(f.label)}${f.required ? ' <i>*</i>' : ''}</span>${input}${f.hint ? `<span class="f-hint">${esc(f.hint)}</span>` : ''}</label>`;
}

function formModal({ title, fields, submit = 'Зберегти', extra = '' }) {
  return new Promise(res => {
    openModal(`<form class="mform" novalidate>
      <div class="m-h"><h3>${esc(title)}</h3><button type="button" class="ib" data-mclose aria-label="Закрити">${ic('x')}</button></div>
      <div class="m-b">${fields.map(fieldHtml).join('')}${extra}</div>
      <div class="m-f"><button type="button" class="btn" data-mclose>Скасувати</button><button class="btn primary" type="submit">${esc(submit)}</button></div>
    </form>`, res);
    const form = $('#modal-root form');
    setTimeout(() => form.querySelector('input:not([type=radio]),textarea,select')?.focus(), 30);
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const fd = new FormData(form); const out = {};
      fields.forEach(f => { out[f.name] = String(fd.get(f.name) ?? '').trim(); });
      S.modalDone?.(out);
    });
  });
}

function confirmModal(text, ok = 'Видалити', danger = true) {
  return new Promise(res => {
    openModal(`<div class="m-b confirm"><p>${text}</p></div>
      <div class="m-f"><button class="btn" data-mclose>Скасувати</button><button class="btn ${danger ? 'danger' : 'primary'}" data-mok>${esc(ok)}</button></div>`, res);
    setTimeout(() => $('#modal-root [data-mok]')?.focus(), 30);
  });
}

/* ================= auth screens ================= */
function renderSplash(text = '') {
  $('#app').innerHTML = `<div class="splash"><div class="logo-mark big"></div><div class="spinner"></div>${text ? `<p class="muted">${esc(text)}</p>` : ''}</div>`;
}

function renderLogin(err = '') {
  document.body.className = 'auth';
  $('#app').innerHTML = `
  <div class="auth-wrap">
    <form class="auth-card" id="loginForm" autocomplete="on">
      <div class="auth-brand"><div class="logo-mark"></div><div><b>AdminHub</b><span>Швидкі шляхи в адмінки</span></div></div>
      <h1>Вхід</h1>
      ${DB.mode === 'demo' ? `<div class="note">Демо-режим: Firebase ще не підключено. Введіть будь-який email та пароль — дані зберігаються лише в цьому браузері.</div>` : ''}
      <label class="field"><span class="f-label">Email</span><input name="email" type="email" autocomplete="username" required inputmode="email"></label>
      <label class="field"><span class="f-label">Пароль</span>
        <span class="pw"><input name="password" type="password" autocomplete="current-password" required><button type="button" class="ib" data-act="pw" aria-label="Показати пароль">${ic('eye')}</button></span></label>
      <label class="check"><input type="checkbox" name="remember" checked><span>Запам'ятати на цьому пристрої</span></label>
      <div class="auth-err" role="alert">${esc(err)}</div>
      <button class="btn primary block lg" type="submit">Увійти</button>
      ${DB.mode === 'firebase' ? `<button type="button" class="linkbtn" data-act="reset">Забули пароль?</button>` : ''}
      <p class="auth-foot">${ic('lock')} Доступ лише для співробітників. Реєстрація закрита.</p>
    </form>
  </div>`;
  const f = $('#loginForm');
  setTimeout(() => f.email.focus(), 50);
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = f.querySelector('[type=submit]'); btn.disabled = true; btn.textContent = 'Вхід…';
    try { await DB.login(f.email.value.trim(), f.password.value, f.remember.checked); }
    catch (ex) {
      const map = {
        'auth/invalid-credential': 'Невірний email або пароль', 'auth/wrong-password': 'Невірний email або пароль',
        'auth/user-not-found': 'Невірний email або пароль', 'auth/invalid-email': 'Некоректний email',
        'auth/too-many-requests': 'Забагато спроб. Зачекайте кілька хвилин.', 'auth/network-request-failed': 'Немає з’єднання з інтернетом',
        'auth/user-disabled': 'Обліковий запис вимкнено',
      };
      $('.auth-err').textContent = map[ex.code] || `Помилка входу (${ex.code || ex.message})`;
      btn.disabled = false; btn.textContent = 'Увійти';
    }
  });
}

function renderNoAccess(email) {
  document.body.className = 'auth';
  $('#app').innerHTML = `<div class="auth-wrap"><div class="auth-card">
    <div class="auth-brand"><div class="logo-mark"></div><div><b>AdminHub</b><span>Швидкі шляхи в адмінки</span></div></div>
    <h1>Немає доступу</h1>
    <p class="muted">Обліковий запис <b>${esc(email)}</b> не додано до списку учасників. Попросіть адміністратора надати доступ.</p>
    <button class="btn block lg" data-act="logout">${ic('logout')} Вийти</button>
  </div></div>`;
}

/* ================= shell ================= */
function renderShell() {
  document.body.className = '';
  $('#app').innerHTML = `
  <div class="layout">
    <aside class="sidebar" id="sidebar"></aside>
    <div class="scrim" data-act="drawer-close"></div>
    <div class="main">
      <header class="topbar">
        <button class="ib only-m" data-act="drawer" aria-label="Меню">${ic('menu')}</button>
        <a class="m-brand only-m" href="#/"><div class="logo-mark sm"></div></a>
        <div class="search">
          ${ic('search')}
          <input id="q" type="search" placeholder="Пошук: «ціна товару», «банер», «доставка»…" autocomplete="off" enterkeyhint="search" aria-label="Пошук">
          <kbd class="only-d">/</kbd>
        </div>
        <button class="btn edit-toggle" data-act="toggle-edit" hidden>${ic('edit')}<span>Редагувати</span></button>
      </header>
      <main id="view" tabindex="-1"></main>
    </div>
    <nav class="bottombar">
      <a href="#/" data-nav="home">${ic('home')}<span>Головна</span></a>
      <button data-act="focus-search" data-nav="search">${ic('search')}<span>Пошук</span></button>
      <a href="#/fav" data-nav="fav">${ic('star')}<span>Обране</span></a>
      <button data-act="drawer" data-nav="menu">${ic('menu')}<span>Сайти</span></button>
    </nav>
  </div>`;
  const q = $('#q');
  q.placeholder = matchMedia('(max-width: 900px)').matches ? 'Що змінити? Напр. «ціна»' : 'Що треба змінити? Напр. «ціна товару», «банер», «доставка»…';
  q.addEventListener('input', () => {
    S.sel = 0;
    const v = q.value;
    const target = v.trim() ? `#/search?q=${encodeURIComponent(v)}` : '#/';
    if (route().name === 'search') history.replaceState(null, '', target); else history.pushState(null, '', target);
    renderView(); renderNav();
  });
  q.addEventListener('keydown', e => {
    if (route().name !== 'search') return;
    const items = $$('.res');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      S.sel = Math.max(0, Math.min(items.length - 1, S.sel + (e.key === 'ArrowDown' ? 1 : -1)));
      items.forEach((el, i) => el.classList.toggle('sel', i === S.sel));
      items[S.sel]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') { e.preventDefault(); items[S.sel]?.click(); }
  });
}

function route() {
  const raw = location.hash.slice(1) || '/';
  let h; try { h = decodeURI(raw); } catch { h = raw; }
  const [path, qs] = h.split('?');
  const p = path.split('/').filter(Boolean);
  const q = new URLSearchParams(qs || '');
  if (p[0] === 's' && p[1]) return { name: 'site', id: p[1], sec: p[2] };
  if (p[0] === 'search') return { name: 'search', q: q.get('q') || '' };
  if (p[0] === 'fav') return { name: 'fav' };
  if (p[0] === 'members') return { name: 'members' };
  return { name: 'home' };
}

function renderSidebar() {
  const r = route();
  const fav = getFav().filter(resolve).length;
  $('#sidebar').innerHTML = `
    <div class="sb-top">
      <a class="brand" href="#/"><div class="logo-mark"></div><div><b>AdminHub</b><span>${DB.mode === 'demo' ? 'демо-режим' : 'швидкі шляхи в адмінки'}</span></div></a>
      <button class="ib only-m" data-act="drawer-close" aria-label="Закрити">${ic('x')}</button>
    </div>
    <nav class="sb-nav">
      <a href="#/" class="${r.name === 'home' ? 'active' : ''}">${ic('home')}<span>Головна</span></a>
      <a href="#/fav" class="${r.name === 'fav' ? 'active' : ''}">${ic('star')}<span>Обране</span>${fav ? `<em>${fav}</em>` : ''}</a>
      ${isAdmin() ? `<a href="#/members" class="${r.name === 'members' ? 'active' : ''}">${ic('users')}<span>Доступи та дані</span></a>` : ''}
    </nav>
    <div class="sb-label"><span>Сайти</span>${S.edit ? `<button class="ib xs" data-act="add-site" title="Додати сайт">${ic('plus')}</button>` : `<span class="muted">${S.sites.length}</span>`}</div>
    <div class="sb-sites">
      ${S.sites.map(s => `<a href="#/s/${esc(s.id)}" class="${r.name === 'site' && r.id === s.id ? 'active' : ''}" style="--site:${safeColor(s.color)}">
        <span class="dot">${esc(initials(s.name))}</span><span class="nm">${esc(s.name)}</span><em>${linkCount(s)}</em></a>`).join('')}
      ${S.loaded && !S.sites.length ? `<p class="muted small pad">Ще немає сайтів</p>` : ''}
    </div>
    <div class="sb-foot">
      <div class="me"><span class="avatar">${esc(initials(S.user.name || S.user.email))}</span><div><b>${esc(S.user.name || S.user.email)}</b><span>${esc(ROLE_LABEL[S.role] || S.role)}</span></div></div>
      <div class="sb-actions">
        <button class="ib" data-act="theme" title="Тема">${ic(isDark() ? 'sun' : 'moon')}</button>
        <button class="ib" data-act="logout" title="Вийти">${ic('logout')}</button>
      </div>
    </div>`;
}

function renderNav() {
  const r = route();
  $$('.bottombar [data-nav]').forEach(el => el.classList.toggle('active', el.dataset.nav === r.name));
  const et = $('.edit-toggle');
  if (et) { et.hidden = !canEdit(); et.classList.toggle('on', S.edit); et.querySelector('span').textContent = S.edit ? 'Готово' : 'Редагувати'; }
  document.body.classList.toggle('editing', S.edit);
  const q = $('#q');
  if (q && document.activeElement !== q) q.value = r.name === 'search' ? r.q : '';
}

function refresh() {
  if (!S.user || !$('#view')) return;
  renderSidebar(); renderNav(); renderView();
}

/* ================= views ================= */
function renderView() {
  const r = route();
  const v = $('#view');
  if (!S.loaded) { v.innerHTML = `<div class="loading"><div class="spinner"></div></div>`; return; }
  let html = '';
  if (r.name === 'site') { const s = site(r.id); html = s ? viewSite(s) : viewMissing(); }
  else if (r.name === 'search') html = viewSearch(r.q);
  else if (r.name === 'fav') html = viewFav();
  else if (r.name === 'members') html = isAdmin() ? viewMembers() : viewMissing();
  else html = viewHome();
  v.innerHTML = html;
  if (r.name === 'site') afterSite(r);
  if (r.name === 'members' && isAdmin()) loadMembers();
  document.title = r.name === 'site' && site(r.id) ? `${site(r.id).name} · AdminHub` : 'AdminHub';
}

const viewMissing = () => `<div class="empty"><h2>Сторінку не знайдено</h2><p class="muted">Можливо, її видалили.</p><a class="btn" href="#/">На головну</a></div>`;

function linkTile(r, showSite = true) {
  const u = safeUrl(r.link.url);
  return `<div class="tile" style="--site:${safeColor(r.site.color)}">
    <a href="${esc(u || '#')}" target="_blank" rel="noopener noreferrer" data-act="open" data-key="${esc(keyOf(r.site, r.sec, r.link))}">
      <span class="t-title">${esc(r.link.title)} ${ic('ext', 'xs')}</span>
      <span class="t-path">${showSite ? `<i class="dot-s"></i>${esc(r.site.name)} · ` : ''}${esc(r.sec.title)}</span>
    </a>
    <button class="ib xs star on" data-act="fav" data-key="${esc(keyOf(r.site, r.sec, r.link))}" title="Прибрати з обраного">${ic('star')}</button>
  </div>`;
}

function viewHome() {
  const fav = getFav().map(resolve).filter(Boolean);
  const rec = getRecent().map(resolve).filter(Boolean).slice(0, 6);
  const hour = new Date().getHours();
  const hi = hour < 6 ? 'Доброї ночі' : hour < 12 ? 'Доброго ранку' : hour < 18 ? 'Доброго дня' : 'Доброго вечора';
  return `
  <div class="page">
    <div class="hero">
      <h1>${hi}, ${esc(S.user.name || '')}</h1>
      <p class="muted">Оберіть сайт або просто почніть писати, що треба змінити — <span class="only-d">натисніть <kbd>/</kbd> для пошуку</span><span class="only-m">пошук зверху</span>.</p>
    </div>
    ${fav.length ? `<section class="block"><div class="block-h"><h2>${ic('star')} Обране</h2><a href="#/fav" class="muted small">Усе</a></div><div class="tiles">${fav.slice(0, 8).map(r => linkTile(r)).join('')}</div></section>` : ''}
    ${rec.length ? `<section class="block"><div class="block-h"><h2>${ic('clock')} Нещодавно відкривали</h2><button class="linkbtn small" data-act="clear-recent">Очистити</button></div>
      <div class="chips-row">${rec.map(r => `<a class="rchip" style="--site:${safeColor(r.site.color)}" href="${esc(safeUrl(r.link.url) || '#')}" target="_blank" rel="noopener noreferrer" data-act="open" data-key="${esc(keyOf(r.site, r.sec, r.link))}"><i class="dot-s"></i>${esc(r.link.title)}<span>${esc(r.site.name)}</span></a>`).join('')}</div></section>` : ''}
    <section class="block">
      <div class="block-h"><h2>Сайти</h2>${S.edit ? `<button class="btn sm" data-act="add-site">${ic('plus')} Додати сайт</button>` : ''}</div>
      <div class="site-grid">
        ${S.sites.map(s => `<a class="site-card" href="#/s/${esc(s.id)}" style="--site:${safeColor(s.color)}">
          <span class="badge">${esc(initials(s.name))}</span>
          <span class="sc-body"><b>${esc(s.name)}</b><span class="muted">${esc(host(s.url) || 'без адреси')}</span></span>
          <span class="sc-meta">${plural(s.sections.length, 'розділ', 'розділи', 'розділів')} · ${plural(linkCount(s), 'посилання', 'посилання', 'посилань')}</span>
        </a>`).join('')}
        ${!S.sites.length ? `<div class="empty-card">${canEdit() ? `Ще немає сайтів. Увімкніть «Редагувати» і додайте перший.` : 'Ще немає сайтів. Зверніться до адміністратора.'}</div>` : ''}
      </div>
    </section>
  </div>`;
}

function viewSite(s) {
  const color = safeColor(s.color);
  const ed = S.edit;
  const secs = s.sections;
  return `
  <div class="page site-page" style="--site:${color}">
    <div class="site-head">
      <a class="ib back only-m" href="#/" aria-label="Назад">${ic('back')}</a>
      <span class="badge lg">${esc(initials(s.name))}</span>
      <div class="sh-title">
        <h1>${esc(s.name)}</h1>
        ${s.url ? `<a href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer" class="muted">${esc(host(s.url))}</a>` : ''}
      </div>
      <div class="sh-actions">
        ${safeUrl(s.url) ? `<a class="btn" href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer">${ic('globe')}<span>Сайт</span></a>` : ''}
        ${safeUrl(s.adminUrl) ? `<a class="btn primary site-c" href="${esc(safeUrl(s.adminUrl))}" target="_blank" rel="noopener noreferrer">${ic('shield')}<span>Адмінка</span></a>` : ''}
        ${ed ? `<button class="btn compact-m" data-act="edit-site" data-site="${esc(s.id)}" title="Налаштування сайту">${ic('edit')}<span>Налаштування</span></button>
                <button class="ib danger-h" data-act="del-site" data-site="${esc(s.id)}" title="Видалити сайт">${ic('trash')}</button>` : ''}
      </div>
    </div>
    ${s.note ? `<p class="site-note">${esc(s.note)}</p>` : ''}
    <div class="toolbar">
      <div class="filter">${ic('filter')}<input id="siteFilter" type="search" placeholder="Фільтр по цьому сайту…" autocomplete="off" value="${esc(S.filter[s.id] || '')}"></div>
      <div class="chips">${secs.map(x => `<button class="chip" data-act="jump" data-sec="${esc(x.id)}"><span>${esc(x.icon || '•')}</span>${esc(x.title)}</button>`).join('')}</div>
    </div>
    <div class="sections">
      ${secs.map((sec, i) => sectionCard(s, sec, i, secs.length)).join('')}
      ${ed ? `<button class="sec add-sec" data-act="add-sec" data-site="${esc(s.id)}">${ic('plus')}<span>Додати розділ</span><small>Напр. «Сторінка товару», «Головна», «SEO»</small></button>` : ''}
    </div>
    ${!secs.length && !ed ? `<div class="empty"><h2>Тут поки порожньо</h2><p class="muted">${canEdit() ? 'Натисніть «Редагувати» вгорі, щоб додати розділи та посилання.' : 'Адміністратор ще не додав посилання.'}</p></div>` : ''}
    <div class="empty filter-empty" hidden><h2>Нічого не знайдено</h2><p class="muted">Спробуйте інше слово або <a href="#" data-act="filter-global">шукайте по всіх сайтах</a>.</p></div>
  </div>`;
}

function sectionCard(s, sec, i, n) {
  const ed = S.edit; const links = sec.links || [];
  const fav = new Set(getFav());
  const d = `data-site="${esc(s.id)}" data-sec="${esc(sec.id)}"`;
  return `<section class="sec" id="sec-${esc(sec.id)}" data-sec="${esc(sec.id)}">
    <header class="sec-h">
      <span class="sec-ic">${esc(sec.icon || '📁')}</span>
      <h2>${esc(sec.title)}</h2>
      <span class="count">${links.length}</span>
      ${ed ? `<span class="acts">
        <button class="ib xs" data-act="sec-move" data-dir="-1" ${d} ${i === 0 ? 'disabled' : ''} title="Вище">${ic('up')}</button>
        <button class="ib xs" data-act="sec-move" data-dir="1" ${d} ${i === n - 1 ? 'disabled' : ''} title="Нижче">${ic('down')}</button>
        <button class="ib xs" data-act="edit-sec" ${d} title="Редагувати розділ">${ic('edit')}</button>
        <button class="ib xs danger-h" data-act="del-sec" ${d} title="Видалити розділ">${ic('trash')}</button></span>` : ''}
    </header>
    ${sec.note ? `<p class="sec-note">${esc(sec.note)}</p>` : ''}
    <ul class="links">
      ${links.map((l, j) => {
        const k = keyOf(s, sec, l); const u = safeUrl(l.url); const on = fav.has(k);
        const dl = `${d} data-link="${esc(l.id)}"`;
        return `<li class="lrow" data-text="${esc(norm([l.title, l.desc, (l.tags || []).join(' '), sec.title].join(' ')))}">
          <a class="link ${u ? '' : 'broken'}" href="${esc(u || '#')}" target="_blank" rel="noopener noreferrer" data-act="open" data-key="${esc(k)}" title="${esc(u || 'Посилання не задано')}">
            <span class="l-title">${esc(l.title)}${ic('ext', 'xs ext')}</span>
            ${l.desc ? `<span class="l-desc">${esc(l.desc)}</span>` : ''}
            ${l.tags?.length ? `<span class="tags">${l.tags.map(t => `<i>${esc(t)}</i>`).join('')}</span>` : ''}
          </a>
          <div class="l-actions">
            ${ed ? `
              <button class="ib xs" data-act="link-move" data-dir="-1" ${dl} ${j === 0 ? 'disabled' : ''} title="Вище">${ic('up')}</button>
              <button class="ib xs" data-act="link-move" data-dir="1" ${dl} ${j === links.length - 1 ? 'disabled' : ''} title="Нижче">${ic('down')}</button>
              <button class="ib xs" data-act="edit-link" ${dl} title="Редагувати">${ic('edit')}</button>
              <button class="ib xs danger-h" data-act="del-link" ${dl} title="Видалити">${ic('trash')}</button>` : `
              <button class="ib xs" data-act="copy" data-url="${esc(u)}" title="Копіювати посилання">${ic('copy')}</button>
              <button class="ib xs star ${on ? 'on' : ''}" data-act="fav" data-key="${esc(k)}" title="${on ? 'Прибрати з обраного' : 'В обране'}">${ic('star')}</button>`}
          </div>
        </li>`;
      }).join('')}
      ${!links.length && !ed ? `<li class="muted small pad">Посилань ще немає</li>` : ''}
    </ul>
    ${ed ? `<button class="add-link" data-act="add-link" ${d}>${ic('plus')} Додати посилання</button>` : ''}
  </section>`;
}

function afterSite(r) {
  S.lastSite = r.id;
  const inp = $('#siteFilter');
  const apply = () => {
    const tk = tokens(inp.value); S.filter[r.id] = inp.value;
    let any = false;
    $$('.sec[data-sec]').forEach(sec => {
      let vis = 0;
      $$('.lrow', sec).forEach(li => { const ok = !tk.length || tk.every(t => li.dataset.text.includes(t)); li.hidden = !ok; if (ok) vis++; });
      const secHit = tk.length && tk.every(t => norm(sec.querySelector('h2').textContent).includes(t));
      if (secHit) $$('.lrow', sec).forEach(li => { li.hidden = false; vis++; });
      sec.hidden = tk.length > 0 && !vis;
      if (!sec.hidden) any = true;
    });
    $('.filter-empty').hidden = !tk.length || any;
  };
  inp.addEventListener('input', apply);
  inp.addEventListener('keydown', e => { if (e.key === 'Escape' && inp.value) { e.stopPropagation(); inp.value = ''; apply(); } });
  if (inp.value) apply();
  if (S.focusFilter) { inp.focus(); S.focusFilter = false; }
  if (r.sec) {
    const el = document.getElementById(`sec-${r.sec}`);
    if (el) { requestAnimationFrame(() => { el.scrollIntoView({ block: 'start' }); flash(el); }); }
  }
}

function flash(el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }

/* ---------- search ---------- */
function searchItems(q) {
  const tk = tokens(q); if (!tk.length) return [];
  const res = [];
  for (const s of S.sites) {
    const sn = norm(s.name + ' ' + host(s.url));
    const push = (it, text) => {
      if (!tk.every(t => text.includes(t))) return;
      const tt = norm(it.title); let score = 0;
      for (const t of tk) { if (tt.startsWith(t)) score += 6; else if (tt.includes(t)) score += 4; else if (sn.includes(t)) score += 1; }
      score += it.type === 'link' ? 2 : it.type === 'sec' ? 1.5 : 0;
      if (S.lastSite === s.id) score += 0.5;
      res.push({ ...it, score });
    };
    push({ type: 'site', site: s, title: s.name }, norm([sn, s.note].join(' ')));
    for (const sec of s.sections) {
      push({ type: 'sec', site: s, sec, title: sec.title }, norm([sn, sec.title, sec.note].join(' ')));
      for (const l of sec.links || []) push({ type: 'link', site: s, sec, link: l, title: l.title }, norm([sn, sec.title, l.title, l.desc, (l.tags || []).join(' ')].join(' ')));
    }
  }
  return res.sort((a, b) => b.score - a.score).slice(0, 80);
}

function hl(text, tk) {
  const s = String(text ?? ''); const low = s.toLowerCase().replace(/ё/g, 'е');
  const marks = new Array(s.length).fill(false);
  for (const t of tk) { let i = 0; while (t && (i = low.indexOf(t, i)) !== -1) { for (let k = i; k < i + t.length; k++) marks[k] = true; i += t.length; } }
  let out = ''; let open = false;
  for (let i = 0; i < s.length; i++) {
    if (marks[i] && !open) { out += '<mark>'; open = true; }
    if (!marks[i] && open) { out += '</mark>'; open = false; }
    out += esc(s[i]);
  }
  return out + (open ? '</mark>' : '');
}

function viewSearch(q) {
  const tk = tokens(q); const res = searchItems(q);
  if (S.sel >= res.length) S.sel = 0;
  return `<div class="page">
    <div class="block-h"><h2>${res.length ? `Знайдено: ${res.length}` : 'Нічого не знайдено'}</h2><span class="muted small only-d">↑↓ вибрати · Enter відкрити · Esc очистити</span></div>
    ${!res.length ? `<div class="empty"><p class="muted">Спробуйте інше слово: «товар», «банер», «ціна», «SEO»…</p></div>` : ''}
    <div class="results">
      ${res.map((r, i) => {
        const c = safeColor(r.site.color);
        if (r.type === 'link') {
          const u = safeUrl(r.link.url);
          return `<a class="res ${i === S.sel ? 'sel' : ''}" style="--site:${c}" href="${esc(u || '#')}" target="_blank" rel="noopener noreferrer" data-act="open" data-key="${esc(keyOf(r.site, r.sec, r.link))}">
            <span class="r-ic">${esc(r.sec.icon || '🔗')}</span>
            <span class="r-main"><span class="r-title">${hl(r.link.title, tk)}</span>
            <span class="r-path"><i class="dot-s"></i>${hl(r.site.name, tk)} › ${hl(r.sec.title, tk)}</span>
            ${r.link.desc ? `<span class="r-desc">${hl(r.link.desc, tk)}</span>` : ''}</span>
            <span class="r-kind">${ic('ext')}</span></a>`;
        }
        if (r.type === 'sec') return `<a class="res ${i === S.sel ? 'sel' : ''}" style="--site:${c}" href="#/s/${esc(r.site.id)}/${esc(r.sec.id)}">
            <span class="r-ic">${esc(r.sec.icon || '📁')}</span>
            <span class="r-main"><span class="r-title">${hl(r.sec.title, tk)}</span><span class="r-path"><i class="dot-s"></i>${hl(r.site.name, tk)} · розділ, ${plural(r.sec.links?.length || 0, 'посилання', 'посилання', 'посилань')}</span></span>
            <span class="r-kind tag">Розділ</span></a>`;
        return `<a class="res ${i === S.sel ? 'sel' : ''}" style="--site:${c}" href="#/s/${esc(r.site.id)}">
            <span class="r-ic badge sm">${esc(initials(r.site.name))}</span>
            <span class="r-main"><span class="r-title">${hl(r.site.name, tk)}</span><span class="r-path">${esc(host(r.site.url))}</span></span>
            <span class="r-kind tag">Сайт</span></a>`;
      }).join('')}
    </div></div>`;
}

function viewFav() {
  const fav = getFav().map(resolve).filter(Boolean);
  const by = new Map();
  fav.forEach(r => { if (!by.has(r.site.id)) by.set(r.site.id, []); by.get(r.site.id).push(r); });
  return `<div class="page">
    <div class="hero"><h1>Обране</h1><p class="muted">Позначайте зірочкою посилання, якими користуєтесь найчастіше. Обране зберігається на цьому пристрої.</p></div>
    ${!fav.length ? `<div class="empty"><div class="empty-ic">${ic('star')}</div><p class="muted">Поки порожньо. Відкрийте сайт і натисніть ☆ біля потрібного посилання.</p></div>` : ''}
    ${[...by.values()].map(list => `<section class="block"><div class="block-h"><h2><span class="badge xs" style="--site:${safeColor(list[0].site.color)}">${esc(initials(list[0].site.name))}</span> ${esc(list[0].site.name)}</h2></div>
      <div class="tiles">${list.map(r => linkTile(r, false)).join('')}</div></section>`).join('')}
  </div>`;
}

function viewMembers() {
  return `<div class="page narrow">
    <div class="hero"><h1>Доступи та дані</h1><p class="muted">Хто може входити в AdminHub і що може робити.</p></div>
    <section class="card">
      <div class="block-h"><h2>${ic('users')} Учасники</h2><button class="btn sm primary" data-act="add-member">${ic('plus')} Додати</button></div>
      <div class="note">${DB.mode === 'firebase'
        ? 'Щоб людина змогла увійти: 1) створіть їй користувача в Firebase Console → Authentication → Users → Add user; 2) додайте її email тут.'
        : 'Демо-режим: у справжній версії користувачів створюють у Firebase Console → Authentication.'}</div>
      <div id="members" class="members"><div class="loading sm"><div class="spinner"></div></div></div>
      <p class="muted small">Перегляд — лише відкриває посилання. Редактор — додає/змінює сайти, розділи, посилання. Адміністратор — ще й керує доступами.</p>
    </section>
    <section class="card">
      <div class="block-h"><h2>${ic('download')} Резервна копія</h2></div>
      <p class="muted small">Експорт усіх сайтів у JSON — зручно для бекапу або масового заповнення. Імпорт замінює сайти з однаковим <code>id</code> і додає нові.</p>
      <div class="row-btns">
        <button class="btn" data-act="export">${ic('download')} Експорт JSON</button>
        <label class="btn">${ic('upload')} Імпорт JSON<input type="file" accept="application/json,.json" id="importFile" hidden></label>
      </div>
    </section>
  </div>`;
}

async function loadMembers() {
  const box = $('#members'); if (!box) return;
  try {
    const list = (await DB.listMembers()).sort((a, b) => a.email.localeCompare(b.email));
    box.innerHTML = list.map(m => `<div class="mrow">
      <span class="avatar">${esc(initials(m.name || m.email))}</span>
      <div class="m-who"><b>${esc(m.name || m.email.split('@')[0])}</b><span>${esc(m.email)}</span></div>
      <select data-act-change="member-role" data-email="${esc(m.email)}" data-name="${esc(m.name || '')}"${m.email === S.user.email ? 'disabled title="Свою роль змінити не можна"' : ''}>
        ${Object.entries(ROLE_LABEL).map(([v, l]) => `<option value="${v}" ${m.role === v ? 'selected' : ''}>${l}</option>`).join('')}
      </select>
      <button class="ib xs danger-h" data-act="del-member" data-email="${esc(m.email)}" ${m.email === S.user.email ? 'disabled' : ''} title="Забрати доступ">${ic('trash')}</button>
    </div>`).join('') || '<p class="muted small">Немає учасників</p>';
  } catch (e) { box.innerHTML = `<p class="err small">Не вдалося завантажити: ${esc(e.code || e.message)}</p>`; }
}

/* ================= mutations ================= */
async function mutate(siteId, fn, msg = 'Збережено') {
  if (!site(siteId)) return;
  try { if (await DB.updateSite(siteId, fn) !== false) toast(msg); }
  catch (e) {
    console.error(e);
    // TypeError = розділ/посилання, яке ми правимо, щойно видалив інший редактор
    toast(e instanceof TypeError ? 'Не збережено: цей елемент щойно змінив інший редактор' : `Не збережено: ${e.code || e.message}`, 'err');
  }
}

const siteFields = (s = {}) => [
  { name: 'name', label: 'Назва', value: s.name, required: true, max: 60, placeholder: 'Напр. Sage Shop' },
  { name: 'url', label: 'Адреса сайту', type: 'url', value: s.url, placeholder: 'https://example.com' },
  { name: 'adminUrl', label: 'Головна сторінка адмінки', type: 'url', value: s.adminUrl, placeholder: 'https://example.com/admin' },
  { name: 'color', label: 'Колір', type: 'colors', value: s.color },
  { name: 'note', label: 'Нотатка', type: 'textarea', value: s.note, rows: 2, placeholder: 'CMS, особливості, кого питати…' },
  { name: 'order', label: 'Порядок у списку', type: 'number', value: s.order ?? '', placeholder: '1, 2, 3…', hint: 'Менше число — вище в списку' },
];
const secFields = (x = {}) => [
  { name: 'icon', label: 'Емодзі', value: x.icon || '📁', max: 4, half: true },
  { name: 'title', label: 'Назва розділу', value: x.title, required: true, max: 60, placeholder: 'Напр. Сторінка товару' },
  { name: 'note', label: 'Підказка (необов’язково)', type: 'textarea', rows: 2, value: x.note, placeholder: 'Що тут зазвичай змінюють' },
];
const linkFields = (s, secId, l = {}) => [
  { name: 'title', label: 'Що змінюємо', value: l.title, required: true, max: 80, placeholder: 'Напр. Ціна та акційна ціна' },
  { name: 'url', label: 'Пряме посилання в адмінку', type: 'url', value: l.url, required: true, placeholder: 'https://…/admin/…' },
  { name: 'desc', label: 'Як знайти / що робити', type: 'textarea', rows: 3, value: l.desc, placeholder: 'Вкладка «Дані» → поле «Ціна». Після змін — «Зберегти».' },
  { name: 'tags', label: 'Ключові слова для пошуку', value: (l.tags || []).join(', '), placeholder: 'ціна, вартість, знижка' },
  { name: 'sec', label: 'Розділ', type: 'select', value: secId, options: s.sections.map(x => ({ value: x.id, label: `${x.icon || ''} ${x.title}` })) },
];
const parseTags = t => [...new Set(String(t || '').split(',').map(x => x.trim()).filter(Boolean))].slice(0, 20);

function slugFromSite(v) {
  const base = (host(v.url) || '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || rid();
  let id = base; let i = 2;
  while (site(id)) id = `${base}-${i++}`;
  return id;
}

const ACTIONS = {
  async 'add-site'() {
    const v = await formModal({ title: 'Новий сайт', fields: siteFields({ color: COLORS[S.sites.length % COLORS.length] }), submit: 'Створити' });
    if (!v) return;
    const s = { id: slugFromSite(v), name: v.name, url: safeUrl(v.url), adminUrl: safeUrl(v.adminUrl), color: safeColor(v.color), note: v.note, order: v.order === '' ? S.sites.length + 1 : Number(v.order), sections: [] };
    try { await DB.saveSite(s); toast('Сайт створено'); location.hash = `#/s/${s.id}`; }
    catch (e) { toast(`Не збережено: ${e.code || e.message}`, 'err'); }
  },
  async 'edit-site'(d) {
    const s = site(d.site); const v = await formModal({ title: 'Налаштування сайту', fields: siteFields(s) }); if (!v) return;
    mutate(s.id, c => { Object.assign(c, { name: v.name, url: safeUrl(v.url), adminUrl: safeUrl(v.adminUrl), color: safeColor(v.color), note: v.note, order: v.order === '' ? null : Number(v.order) }); });
  },
  async 'del-site'(d) {
    const s = site(d.site);
    if (!await confirmModal(`Видалити сайт <b>${esc(s.name)}</b> разом з усіма розділами (${s.sections.length}) і посиланнями (${linkCount(s)})?<br><span class="muted small">Цю дію не можна скасувати. Рекомендуємо спершу зробити експорт.</span>`)) return;
    try { await DB.deleteSite(s.id); toast('Сайт видалено'); location.hash = '#/'; } catch (e) { toast(`Помилка: ${e.code || e.message}`, 'err'); }
  },
  async 'add-sec'(d) {
    const v = await formModal({ title: 'Новий розділ', fields: secFields(), submit: 'Додати' }); if (!v) return;
    mutate(d.site, c => { c.sections.push({ id: rid(), icon: v.icon, title: v.title, note: v.note, links: [] }); });
  },
  async 'edit-sec'(d) {
    const sec = site(d.site).sections.find(x => x.id === d.sec);
    const v = await formModal({ title: 'Редагувати розділ', fields: secFields(sec) }); if (!v) return;
    mutate(d.site, c => { Object.assign(c.sections.find(x => x.id === d.sec), { icon: v.icon, title: v.title, note: v.note }); });
  },
  async 'del-sec'(d) {
    const sec = site(d.site).sections.find(x => x.id === d.sec);
    if (!await confirmModal(`Видалити розділ <b>${esc(sec.title)}</b> і ${plural(sec.links?.length || 0, 'посилання', 'посилання', 'посилань')} в ньому?`)) return;
    mutate(d.site, c => { c.sections = c.sections.filter(x => x.id !== d.sec); }, 'Розділ видалено');
  },
  'sec-move'(d) {
    mutate(d.site, c => { const i = c.sections.findIndex(x => x.id === d.sec); const j = i + Number(d.dir); if (j < 0 || j >= c.sections.length) return false; [c.sections[i], c.sections[j]] = [c.sections[j], c.sections[i]]; }, 'Порядок змінено');
  },
  async 'add-link'(d) {
    const s = site(d.site);
    const v = await formModal({ title: 'Нове посилання', fields: linkFields(s, d.sec), submit: 'Додати' }); if (!v) return;
    mutate(d.site, c => { const sec = c.sections.find(x => x.id === v.sec) || c.sections.find(x => x.id === d.sec); (sec.links ||= []).push({ id: rid(), title: v.title, url: safeUrl(v.url), desc: v.desc, tags: parseTags(v.tags) }); }, 'Посилання додано');
  },
  async 'edit-link'(d) {
    const s = site(d.site); const l = s.sections.find(x => x.id === d.sec).links.find(x => x.id === d.link);
    const v = await formModal({ title: 'Редагувати посилання', fields: linkFields(s, d.sec, l) }); if (!v) return;
    mutate(d.site, c => {
      const from = c.sections.find(x => x.id === d.sec); const i = from.links.findIndex(x => x.id === d.link);
      const nl = { ...from.links[i], title: v.title, url: safeUrl(v.url), desc: v.desc, tags: parseTags(v.tags) };
      if (v.sec && v.sec !== d.sec) { from.links.splice(i, 1); (c.sections.find(x => x.id === v.sec).links ||= []).push(nl); }
      else from.links[i] = nl;
    });
  },
  async 'del-link'(d) {
    const l = site(d.site).sections.find(x => x.id === d.sec).links.find(x => x.id === d.link);
    if (!await confirmModal(`Видалити посилання <b>${esc(l.title)}</b>?`)) return;
    mutate(d.site, c => { const sec = c.sections.find(x => x.id === d.sec); sec.links = sec.links.filter(x => x.id !== d.link); }, 'Посилання видалено');
  },
  'link-move'(d) {
    mutate(d.site, c => { const L = c.sections.find(x => x.id === d.sec).links; const i = L.findIndex(x => x.id === d.link); const j = i + Number(d.dir); if (j < 0 || j >= L.length) return false; [L[i], L[j]] = [L[j], L[i]]; }, 'Порядок змінено');
  },
  fav(d, el) {
    const f = getFav(); const i = f.indexOf(d.key);
    if (i >= 0) f.splice(i, 1); else f.unshift(d.key);
    LS.set(favKey(), f);
    toast(i >= 0 ? 'Прибрано з обраного' : 'Додано в обране');
    if (route().name === 'site') { el.classList.toggle('on', i < 0); renderSidebar(); } else refresh();
  },
  open(d) {
    const r = getRecent().filter(k => k !== d.key); r.unshift(d.key); LS.set(recKey(), r.slice(0, 12));
  },
  async copy(d) {
    if (!d.url) return toast('Посилання не задано', 'err');
    try { await navigator.clipboard.writeText(d.url); toast('Посилання скопійовано'); } catch { toast('Не вдалося скопіювати', 'err'); }
  },
  jump(d) {
    const el = document.getElementById(`sec-${d.sec}`); if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' }); flash(el);
  },
  'filter-global'(d, el, e) { e.preventDefault(); const v = $('#siteFilter')?.value || ''; location.hash = `#/search?q=${encodeURIComponent(v)}`; },
  'clear-recent'() { LS.set(recKey(), []); refresh(); },
  'toggle-edit'() { if (!canEdit()) return; S.edit = !S.edit; refresh(); },
  theme() { LS.set('ah-theme', isDark() ? 'light' : 'dark'); applyTheme(); renderSidebar(); },
  async logout() { await DB.logout(); },
  reload() { location.reload(); },
  drawer() { document.body.classList.add('drawer-open'); },
  'drawer-close'() { document.body.classList.remove('drawer-open'); },
  'focus-search'() { const q = $('#q'); q.focus(); q.select(); },
  pw(d, el) { const i = el.parentElement.querySelector('input'); i.type = i.type === 'password' ? 'text' : 'password'; },
  async reset() {
    const email = $('#loginForm')?.email.value.trim();
    if (!email) { $('.auth-err').textContent = 'Введіть email, а потім натисніть «Забули пароль?»'; return; }
    try { await DB.reset(email); } catch { /* do not reveal whether the account exists */ }
    $('.auth-err').textContent = ''; toast('Якщо такий акаунт існує — лист для зміни пароля надіслано');
  },
  async 'add-member'() {
    const v = await formModal({ title: 'Надати доступ', submit: 'Додати', fields: [
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'name@company.com' },
      { name: 'name', label: 'Ім’я', placeholder: 'Як показувати в додатку' },
      { name: 'role', label: 'Роль', type: 'select', value: 'viewer', options: Object.entries(ROLE_LABEL).map(([value, label]) => ({ value, label })) },
    ] });
    if (!v) return;
    try { await DB.saveMember(v.email.toLowerCase(), { role: v.role, name: v.name }); toast('Доступ надано'); loadMembers(); }
    catch (e) { toast(`Помилка: ${e.code || e.message}`, 'err'); }
  },
  async 'del-member'(d) {
    if (!await confirmModal(`Забрати доступ у <b>${esc(d.email)}</b>?<br><span class="muted small">Користувач залишиться у Firebase Authentication, але не бачитиме жодних даних.</span>`, 'Забрати доступ')) return;
    try { await DB.deleteMember(d.email); toast('Доступ забрано'); loadMembers(); } catch (e) { toast(`Помилка: ${e.code || e.message}`, 'err'); }
  },
  export() {
    const data = S.sites.map(({ updatedAt, updatedBy, ...s }) => s);
    const blob = new Blob([JSON.stringify({ app: 'AdminHub', exportedAt: new Date().toISOString(), sites: data }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `adminhub-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  },
};

async function importFile(file) {
  try {
    const json = JSON.parse(await file.text());
    const list = Array.isArray(json) ? json : json.sites;
    if (!Array.isArray(list)) throw new Error('Невірний формат: очікується масив sites');
    // id потрапляють у адресу та ключі обраного ("сайт/розділ/посилання") — лише безпечні символи
    const cleanId = v => String(v).replace(/[^a-z0-9_-]/gi, '-').slice(0, 60) || rid();
    const clean = list.filter(s => s && s.name).map((s, i) => ({
      id: cleanId(s.id || slugFromSite(s)),
      name: String(s.name).slice(0, 60), url: safeUrl(s.url), adminUrl: safeUrl(s.adminUrl), color: safeColor(s.color),
      note: String(s.note || ''), order: Number.isFinite(+s.order) ? +s.order : i + 1,
      sections: (s.sections || []).map(sec => ({
        id: cleanId(sec.id || rid()), icon: String(sec.icon || '📁').slice(0, 4), title: String(sec.title || 'Без назви'), note: String(sec.note || ''),
        links: (sec.links || []).map(l => ({ id: cleanId(l.id || rid()), title: String(l.title || 'Без назви'), url: safeUrl(l.url), desc: String(l.desc || ''), tags: Array.isArray(l.tags) ? l.tags.map(String) : parseTags(l.tags) })),
      })),
    }));
    if (!clean.length) throw new Error('У файлі немає сайтів');
    const exist = clean.filter(s => site(s.id)).length;
    if (!await confirmModal(`Імпортувати ${plural(clean.length, 'сайт', 'сайти', 'сайтів')}?${exist ? `<br><b>${exist}</b> з них вже існують і будуть замінені.` : ''}`, 'Імпортувати', !!exist)) return;
    for (const s of clean) await DB.saveSite(s);
    toast(`Імпортовано: ${clean.length}`);
  } catch (e) { toast(`Імпорт не вдався: ${e.message}`, 'err'); }
}

/* ================= global events ================= */
document.addEventListener('click', e => {
  if (S.modalDone) {
    if (e.target.matches('.overlay') || e.target.closest('[data-mclose]')) { S.modalDone(null); return; }
    if (e.target.closest('[data-mok]')) { S.modalDone(true); return; }
  }
  const t = e.target.closest('[data-act]');
  if (!t) {
    if (e.target.closest('.sidebar a[href]')) document.body.classList.remove('drawer-open');
    return;
  }
  const act = t.dataset.act;
  if (act !== 'open' && t.tagName !== 'A' && t.tagName !== 'LABEL') e.preventDefault();
  if (act === 'open' && t.getAttribute('href') === '#') { e.preventDefault(); toast('Посилання не задано', 'err'); return; }
  ACTIONS[act]?.(t.dataset, t, e);
});

document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'importFile' && t.files[0]) { importFile(t.files[0]); t.value = ''; }
  if (t.dataset.actChange === 'member-role') {
    DB.saveMember(t.dataset.email, { role: t.value, name: t.dataset.name || '' })
      .then(() => toast('Роль змінено')).catch(err => toast(`Помилка: ${err.code || err.message}`, 'err'));
  }
});

document.addEventListener('keydown', e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
  if (e.key === 'Escape') {
    if (S.modalDone) { S.modalDone(null); return; }
    if (document.body.classList.contains('drawer-open')) { document.body.classList.remove('drawer-open'); return; }
    if (document.activeElement?.id === 'q') { const q = $('#q'); if (q.value) { q.value = ''; q.dispatchEvent(new Event('input')); } else q.blur(); }
    return;
  }
  if (!S.user || S.modalDone) return;
  if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
    e.preventDefault(); ACTIONS['focus-search']();
  }
  if (e.key.toLowerCase() === 'f' && !typing && !e.ctrlKey && !e.metaKey && route().name === 'site') { e.preventDefault(); $('#siteFilter')?.focus(); }
});

window.addEventListener('hashchange', () => { S.sel = 0; document.body.classList.remove('drawer-open'); refresh(); $('#view')?.scrollTo?.(0, 0); if (route().name !== 'site' || !route().sec) window.scrollTo(0, 0); });
window.addEventListener('popstate', () => { S.sel = 0; refresh(); });
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { applyTheme(); if (S.user) renderSidebar(); });

/* ================= boot ================= */
async function onAuth(user) {
  unsubSites?.(); unsubSites = null;
  if (!user) { S.user = null; renderLogin(); return; }
  renderSplash('Перевірка доступу…');
  const email = String(user.email || '').toLowerCase();
  let member = null;
  try { member = await DB.getMember(email); } catch (e) { console.warn(e); }
  if (!member || !ROLE_LABEL[member.role]) { renderNoAccess(email); return; }
  S.user = { email, name: member.name || user.displayName || email.split('@')[0] };
  S.role = member.role; S.edit = false; S.loaded = false;
  renderShell(); refresh();
  unsubSites = DB.subscribeSites(
    list => { S.sites = sortSites(list); S.loaded = true; const f = document.activeElement?.id; refresh(); if (f === 'siteFilter') $('#siteFilter')?.focus(); },
    err => { console.error(err); S.loaded = true; refresh(); toast(`Немає доступу до даних (${err.code})`, 'err'); },
  );
}

async function boot() {
  applyTheme();
  try { DB = configured ? await makeFirebase(firebaseConfig) : makeDemo(); }
  catch (e) {
    console.error(e);
    $('#app').innerHTML = `<div class="splash"><div class="logo-mark big"></div><p>Не вдалося завантажити Firebase.<br><span class="muted">Перевірте з’єднання та оновіть сторінку.</span></p><button class="btn" data-act="reload">Оновити</button></div>`;
    return;
  }
  DB.onAuth(onAuth);
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
}
boot();
