import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from "node:url";
const SP = path.dirname(fileURLToPath(import.meta.url));
const TRIP = 'C:/Users/c0787/Desktop/香港深圳旅遊_2027-01';
const HTML = TRIP + '/香港深圳行程.html';
const files = [['research_hk.json','香港'],['research_macau.json','澳門'],['research_sz.json','深圳']];
const regions = [];
for (const [f, name] of files) {
  const p = path.join(SP, f);
  if (!fs.existsSync(p)) { console.log('MISSING', f); regions.push({region:name, areas:[]}); continue; }
  const raw = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
  const d = JSON.parse(raw);
  const areas = (d.areas||[]).map(a => ({area:a.area, day:a.day||'', food:a.food||[], shop:a.shop||a.shopping||[], sights:a.sights||[]}));
  const extra = d.day_trip_ideas || [];
  const practical = [].concat(d.practical||[], d.transport||[], d.practical_info||[]);
  regions.push({region:name, areas, extra, extraTitle: extra.length ? '1/29–1/30 一日／半日候選' : '', practical, notes:d.notes||[]});
  const c = k => areas.reduce((s,a)=>s+a[k].length,0);
  console.log(name, 'areas', areas.length, 'food', c('food'), 'shop', c('shop'), 'sights', c('sights'), 'extra', extra.length, 'practical', practical.length, 'notes', (d.notes||[]).length);
}
const data = {regions};
fs.writeFileSync(TRIP + '/資料_美食購物景點.json', JSON.stringify(data, null, 2), 'utf8');
const json = JSON.stringify(data).replace(/</g, '\\u003c');
let html = fs.readFileSync(HTML, 'utf8');
const re = /<!--GUIDE_DATA-->[\s\S]*?<!--END_GUIDE_DATA-->/;
if (!re.test(html)) throw new Error('marker not found');
html = html.replace(re, () => '<!--GUIDE_DATA--><script type="application/json" id="guide-data">' + json + '</script><!--END_GUIDE_DATA-->');
fs.writeFileSync(HTML, html, 'utf8');
console.log('html bytes', Buffer.byteLength(html));

// ---- 必吃資料 ----
const eat = {};
for (const [f,k] of [['research_hk_musteat.json','hk'],['research_sz_eat.json','sz']]) {
  const p = path.join(SP, f);
  if (fs.existsSync(p)) { eat[k] = JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,'')); console.log('eat', k, 'dishes', (eat[k].dishes||[]).length, 'slots', (eat[k].slots||[]).length); }
  else console.log('eat MISSING', f);
}
let h2 = fs.readFileSync(HTML, 'utf8');
const re2 = /<!--EAT_DATA-->[\s\S]*?<!--END_EAT_DATA-->/;
if (!re2.test(h2)) throw new Error('eat marker not found');
h2 = h2.replace(re2, () => '<!--EAT_DATA--><script type="application/json" id="eat-data">' + JSON.stringify(eat).split("<").join("\\u003c") + '</script><!--END_EAT_DATA-->');
fs.writeFileSync(HTML, h2, 'utf8');
fs.writeFileSync(TRIP + '/資料_必吃.json', JSON.stringify(eat, null, 2), 'utf8');

// ---- 迪士尼與交通 ----
const dt = {};
for (const [f,k] of [['research_disney.json','disney'],['research_transport.json','transport'],['research_daily_transport.json','daily'],['research_followup.json','followup']]) {
  const p = path.join(SP, f);
  if (fs.existsSync(p)) dt[k] = JSON.parse(fs.readFileSync(p,'utf8').replace(/^﻿/,''));
}
let h3 = fs.readFileSync(HTML, 'utf8');
const re3 = /<!--DT_DATA-->[\s\S]*?<!--END_DT_DATA-->/;
if (re3.test(h3)) {
  h3 = h3.replace(re3, () => '<!--DT_DATA--><script type="application/json" id="dt-data">' + JSON.stringify(dt).split('<').join('\u003c') + '</script><!--END_DT_DATA-->');
  fs.writeFileSync(HTML, h3, 'utf8');
  fs.writeFileSync(TRIP + '/資料_迪士尼與交通.json', JSON.stringify(dt, null, 2), 'utf8');
  console.log('dt merged', Object.keys(dt));
} else console.log('dt marker missing');

// 自動同步產生 index.html 供 GitHub Pages 部署使用
fs.copyFileSync(HTML, TRIP + '/index.html');
console.log('index.html synced');
