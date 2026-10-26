"use strict";
(() => {
const i18n = {
                ko: {
                    "profile-desc": "한국과 일본의 지하 아이돌을 중심으로 곡을 제공하고 있습니다.\n작곡, 편곡, 작사, 번역, 기타 녹음 등의 의뢰를 받고 있습니다.",
                    "contact-desc": "의뢰는 X의 DM으로 편하게 문의해주세요.",
                    "role-all": "작사・작곡・편곡",
                    "role-comp-arr": "작곡・편곡",
                    "role-co-all": "작곡・편곡・공동 작사",
                    "role-arr": "편곡",
                    "works-title": "Works",
                    "vocaloid-title": "Vocaloid"
                },
                ja: {
                    "profile-desc": "韓国と日本のライブアイドルを中心に楽曲提供をしています。\n作曲・編曲・作詞・翻訳・ギターレコーディング等のご依頼を承ります。",
                    "contact-desc": "ご依頼は、XのDMよりお気軽にご相談ください。",
                    "role-all": "作詞・作曲・編曲",
                    "role-comp-arr": "作曲・編曲",
                    "role-co-all": "作曲・編曲・共作詞",
                    "role-arr": "編曲",
                    "works-title": "Works",
                    "vocaloid-title": "Vocaloid"
                }
            };
const ui = {
 ja: {all:'すべて',skip:'楽曲一覧へ',filter:'楽曲の絞り込み',view:'表示形式',grid:'サムネイル表示',list:'リスト表示',top:'ページの先頭へ'},
 ko: {all:'전체',skip:'곡 목록으로 이동',filter:'곡 분류',view:'보기 방식',grid:'썸네일 보기',list:'목록 보기',top:'맨 위로 이동'}
};
function setLanguage(lang) {
 document.documentElement.lang = lang;
 document.querySelectorAll('[data-i18n]').forEach(el => {
  const value = i18n[lang][el.dataset.i18n];
  if (value) el.textContent = value;
 });
 document.querySelectorAll('[data-ui]').forEach(el => { el.textContent = ui[lang][el.dataset.ui]; });
 document.querySelectorAll('[data-ui-aria]').forEach(el => { el.setAttribute('aria-label', ui[lang][el.dataset.uiAria]); });
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
function filterMusic(category) {
 cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
 document.querySelector('#category-title').textContent = {all:'All',vocaloid:'Vocaloid',works:'Works'}[category];
 document.querySelector('.section-count').textContent = String(cards.filter(card => !card.hidden).length).padStart(2, '0');
 document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => filterMusic(button.dataset.filter)));
function showLinkedCategory() {
 const category = location.hash.slice(1);
 if (['works','vocaloid'].includes(category)) {
  filterMusic(category);
  catalog.scrollIntoView();
 }
}
document.querySelectorAll('.topbar nav a').forEach(link => link.addEventListener('click', () => {
 filterMusic(link.hash.slice(1));
 catalog.scrollIntoView();
}));
window.addEventListener('hashchange', showLinkedCategory);
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
