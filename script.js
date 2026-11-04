"use strict";
(() => {
const i18n = {
                ko: {
                    "profile-desc": "한국과 일본의 지하 아이돌을 중심으로 곡을 제공하고 있습니다.\n작곡, 편곡, 작사, 번역, 기타 녹음 등의 의뢰를 받고 있습니다.",
                    "contact-desc": "의뢰는 X의 DM으로 편하게 문의해주세요.",
                },
                ja: {
                    "profile-desc": "韓国と日本のライブアイドルを中心に楽曲提供をしています。\n作曲・編曲・作詞・翻訳・ギターレコーディング等のご依頼を承ります。",
                    "contact-desc": "ご依頼は、XのDMよりお気軽にご相談ください。",
                }
            };
const ui = {
 ja: {all:'すべて',composition:'作曲',arrangement:'編曲',lyrics:'作詞',skip:'楽曲一覧へ',filter:'楽曲の絞り込み',view:'表示形式',grid:'サムネイル表示',list:'リスト表示',top:'ページの先頭へ'},
 ko: {all:'전체',composition:'작곡',arrangement:'편곡',lyrics:'작사',skip:'곡 목록으로 이동',filter:'곡 분류',view:'보기 방식',grid:'썸네일 보기',list:'목록 보기',top:'맨 위로 이동'}
};
const sharedRoles = {
 ja: {composition:'共作曲',arrangement:'共編曲',lyrics:'共作詞'},
 ko: {composition:'공작곡',arrangement:'공편곡',lyrics:'공작사'}
};
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const filters = new Set(filterButtons.map(button => button.dataset.filter));
let activeFilter = 'all';
function setLanguage(lang) {
 document.documentElement.lang = lang;
 document.querySelectorAll('[data-i18n]').forEach(el => {
  const value = i18n[lang][el.dataset.i18n];
  if (value) el.textContent = value;
 });
 document.querySelectorAll('[data-ui]').forEach(el => { el.textContent = ui[lang][el.dataset.ui]; });
 document.querySelectorAll('[data-ui-aria]').forEach(el => { el.setAttribute('aria-label', ui[lang][el.dataset.uiAria]); });
 document.querySelectorAll('[data-role]').forEach(el => {
  const labels = el.dataset.shared === 'true' ? sharedRoles[lang] : ui[lang];
  el.textContent = labels[el.dataset.role] || el.dataset.role;
 });
 document.querySelector('#category-title').textContent = ui[lang][activeFilter];
 document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
}
let storedLanguage;
try { storedLanguage = localStorage.getItem('narenai-language'); } catch (_) { /* File and private browsing remain supported. */ }
const browserLanguage = (navigator.languages?.[0] || navigator.language || 'ja').toLowerCase();
setLanguage(['ko','ja'].includes(storedLanguage) ? storedLanguage : browserLanguage.startsWith('ko') ? 'ko' : 'ja');
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => {
 setLanguage(button.dataset.lang);
 try { localStorage.setItem('narenai-language', button.dataset.lang); } catch (_) {}
}));
const catalog = document.querySelector('.catalog');
const grid = catalog.querySelector('.song-grid');
const cards = Array.from(grid.querySelectorAll('.song-card'));
// Stable role IDs drive filtering regardless of language or shared credit.
// Category remains independent metadata (works / vocaloid).
const cardRoles = new Map(cards.map(card => [card,
 new Set(Array.from(card.querySelectorAll('[data-role]'), credit => credit.dataset.role))
]));
const matchesFilter = (card, role) => role === 'all' || cardRoles.get(card).has(role);
filterButtons.forEach(button => {
 button.querySelector('small').textContent = String(cards.filter(card => matchesFilter(card, button.dataset.filter)).length);
});
// ISO calendar dates sort chronologically without timezone conversion.
// The HTML datetime attribute is the single source of truth for each date.
cards.forEach(card => {
 const date = card.querySelector('time[datetime]');
 date.textContent = date.dateTime;
});
cards.sort((a, b) => {
 const first = a.querySelector('time').dateTime;
 const second = b.querySelector('time').dateTime;
 return second.localeCompare(first);
});
grid.append(...cards);
function filterMusic(role) {
 activeFilter = filters.has(role) ? role : 'all';
 cards.forEach(card => { card.hidden = !matchesFilter(card, activeFilter); });
 document.querySelector('#category-title').textContent = ui[document.documentElement.lang][activeFilter];
 document.querySelector('.section-count').textContent = String(cards.filter(card => !card.hidden).length).padStart(2, '0');
 filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter)));
}
filterButtons.forEach(button => button.addEventListener('click', () => {
 filterMusic(button.dataset.filter);
 // Replace rather than jump so choosing a tab keeps the current scroll position.
 try { history.replaceState(null, '', '#' + activeFilter); } catch (_) {}
}));
function showLinkedCategory() {
 const role = location.hash.slice(1);
 // Old category bookmarks now open the complete catalog.
 if (filters.has(role) || ['works','vocaloid','catalog'].includes(role)) {
  filterMusic(role);
  catalog.scrollIntoView();
 } else if (!role) {
  filterMusic('all');
 }
}
document.querySelectorAll('.topbar nav a').forEach(link => link.addEventListener('click', () => {
 filterMusic(link.hash.slice(1));
 catalog.scrollIntoView();
}));
window.addEventListener('hashchange', showLinkedCategory);
filterMusic('all');
showLinkedCategory();
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
 catalog.classList.toggle('list-view', button.dataset.view === 'list');
 document.querySelectorAll('[data-view]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
}));
// Keep the designed cover visible if a video thumbnail is unavailable.
document.querySelectorAll('.thumbnail img').forEach(img => {
 const fallback = () => { img.classList.add('failed'); };
 img.addEventListener('error', fallback);
 img.addEventListener('load', () => { if (img.naturalWidth < 200) fallback(); });
 if (img.complete && img.naturalWidth < 200) fallback();
});
document.querySelector('.catalog-toolbar').hidden = false;
document.querySelector('.language-switch').hidden = false;
})();
