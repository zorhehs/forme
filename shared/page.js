export const TYPES = ['nav', 'hero', 'features', 'text', 'image', 'testimonial', 'cta', 'footer'];
export const LABELS = {nav:'Navigation',hero:'Hero',features:'Feature grid',text:'Text section',image:'Image',testimonial:'Testimonial',cta:'Call to action',footer:'Footer'};
export const uid = () => crypto.randomUUID();
const defaults = {
 nav:{title:'studio north',links:'Work, About, Contact',button:'Let’s talk',url:'#contact'},
 hero:{eyebrow:'INDEPENDENT DESIGN STUDIO',title:'Good things\nstart with a little\nperspective.',body:'We turn ambitious ideas into thoughtful digital experiences. Built with care. Made to matter.',button:'Explore our work',url:'#work'},
 features:{eyebrow:'WHAT WE BRING',title:'Small studio.\nBig possibilities.',items:'Brand strategy|A clear point of view, from your first impression to your lasting impact.\nDigital experiences|Thoughtful websites that feel as good as they work.\nCreative direction|A fresh perspective, grounded in what makes you different.'},
 text:{eyebrow:'A LITTLE ABOUT US',title:'Less noise.\nMore meaning.',body:'We believe the best work happens when curiosity meets intention. We’re a small team of makers, thinkers, and endlessly curious people.'},
 image:{title:'A different perspective',body:'Space to think. Room to create.',src:'',alt:'Abstract architectural composition'},
 testimonial:{title:'“They saw the possibility in our idea and made it something extraordinary.”',body:'Alex Morgan',eyebrow:'FOUNDER, COMMON GROUND'},
 cta:{eyebrow:'SOMETHING IN MIND?',title:'Let’s make\nsomething matter.',body:'Tell us where you want to go. We’ll help you get there.',button:'Start a conversation',url:'mailto:hello@example.com'},
 footer:{title:'studio north',body:'Independent minds. Shared ambition.',links:'Instagram, LinkedIn, Email'}
};
export function section(type) {return {id:uid(),type,content:{...defaults[type]},style:{background:type==='cta'?'#263d32':'#faf9f6',color:type==='cta'?'#ffffff':'#24392f',padding:type==='nav'||type==='footer'?28:72,align:'left'}};}
export function template(kind='studio') {
 let sections = kind==='blank'?[]:['nav','hero','features','text','cta','footer'].map(section);
 const page={version:1,theme:{accent:'#d7ed8b',font:'sans',radius:8},sections};
 if(kind==='portfolio') {page.theme.accent='#f5b3a2';sections[0].content.title='Alex / Designer';sections[1].content={...sections[1].content,eyebrow:'DESIGNER & CREATIVE THINKER',title:'Making the\neveryday feel\nextraordinary.',body:'I’m Alex, a designer exploring the space between useful and unexpected.',button:'Selected projects'};sections[2].content.title='Made with\nintention.';}
 if(kind==='product') {page.theme.accent='#b9c7f4';sections[0].content.title='orbit';sections[1].content={...sections[1].content,eyebrow:'MORE SPACE FOR YOUR IDEAS',title:'Your next big\nidea starts\nright here.',body:'A calmer place for your projects, notes, and everything in between.',button:'Get started'};sections[2].content.title='Everything you need.\nNothing you don’t.';}
 return page;
}
export function validatePage(p) {
 if(!p||p.version!==1||!p.theme||!['sans','serif','mono'].includes(p.theme.font)||!/^#[0-9a-f]{6}$/i.test(p.theme.accent)||!Number.isInteger(p.theme.radius)||p.theme.radius<0||p.theme.radius>40||!Array.isArray(p.sections)||p.sections.length>60) return false;
 const ids=new Set();
 return p.sections.every(s=>{
  if(!s||!TYPES.includes(s.type)||typeof s.id!=='string'||!/^[a-zA-Z0-9-]{1,80}$/.test(s.id)||ids.has(s.id)||!s.content||!s.style) return false;
  ids.add(s.id);
  return Object.keys(s.content).every(k=>Object.hasOwn(defaults[s.type],k))&&Object.keys(defaults[s.type]).every(k=>typeof s.content[k]==='string'&&s.content[k].length<=5000)&&/^#[0-9a-f]{6}$/i.test(s.style.background)&&/^#[0-9a-f]{6}$/i.test(s.style.color)&&Number.isFinite(s.style.padding)&&s.style.padding>=0&&s.style.padding<=160&&['left','center','right'].includes(s.style.align);
 });
}
export function moveSection(page, from, to) {const p=structuredClone(page);if(from<0||to<0||from>=p.sections.length||to>=p.sections.length)return p;const [s]=p.sections.splice(from,1);p.sections.splice(to,0,s);return p;}
export const escapeHTML = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeURL(value,image=false) {
 const v=String(value??'').trim();
 if(!image&&/^#[a-zA-Z0-9_-]*$/.test(v))return v;
 try {const u=new URL(v);if(['http:','https:',...(!image?['mailto:','tel:']:[])].includes(u.protocol)) return escapeHTML(v);}catch{}
 return image?'':'#';
}
const e=escapeHTML;
const text=v=>e(v).replace(/\n/g,'<br>');
const art=()=>`<svg class="art" viewBox="0 0 500 530" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Abstract geometric sculpture in green and cream"><defs><linearGradient id="stone" x2="1" y2="1"><stop stop-color="#eeeee0"/><stop offset="1" stop-color="#b9bb9e"/></linearGradient><linearGradient id="green" x2="1" y2="1"><stop stop-color="#48624b"/><stop offset="1" stop-color="#23392d"/></linearGradient><pattern id="lines" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 0V6" stroke="#ffffff" stroke-opacity=".13"/></pattern></defs><rect width="500" height="530" fill="#e8e8dc"/><circle cx="412" cy="95" r="132" fill="#d7deba"/><ellipse cx="270" cy="461" rx="180" ry="31" fill="#b5b7a4" opacity=".45"/><path d="M98 444V232a144 144 0 0 1 288 0v212H98Zm81-4h126V236a63 63 0 0 0-126 0Z" fill="url(#green)" fill-rule="evenodd"/><path d="M98 444V232a144 144 0 0 1 288 0v212H98Zm81-4h126V236a63 63 0 0 0-126 0Z" fill="url(#lines)" fill-rule="evenodd"/><path d="M276 469V339a77 77 0 0 1 154 0v130h-44V342a33 33 0 0 0-66 0v127Z" fill="url(#stone)"/><circle cx="107" cy="411" r="48" fill="#d8eb92"/><path d="M64 412h87M107 364v95" stroke="#bccd80" stroke-width="1"/><text x="28" y="34" font-family="sans-serif" font-size="10" letter-spacing="2" fill="#586451">FORM / PERSPECTIVE No. 01</text><text x="435" y="504" font-family="sans-serif" font-size="11" fill="#586451">↗</text></svg>`;
function markup(s) {
 const c=s.content;const button=()=>`<a class="button" href="${safeURL(c.url)}">${e(c.button)} <span aria-hidden="true">↗</span></a>`;
 switch(s.type){
 case 'nav':return `<nav class="wrap navigation" aria-label="Main navigation"><a class="wordmark" href="#">${e(c.title)}<span class="brand-dot">®</span></a><div class="nav-links">${c.links.split(',').map(l=>`<a href="#${e(l.trim().toLowerCase().replace(/[^a-z0-9]/g,''))}">${e(l.trim())}</a>`).join('')}</div>${button()}</nav>`;
 case 'hero':return `<div class="wrap hero"><div><p class="eyebrow">${e(c.eyebrow)}</p><h1>${text(c.title)}</h1><p class="description">${text(c.body)}</p>${button()}<p class="small-note">THOUGHTFULLY MADE. UNIQUELY YOURS.</p></div><div class="art-frame">${art()}<div class="art-caption"><span>A fresh point of view.</span><span>01 / 03</span></div></div></div>`;
 case 'features':return `<div class="wrap" id="work"><p class="eyebrow">${e(c.eyebrow)}</p><h2>${text(c.title)}</h2><div class="features">${c.items.split('\n').filter(Boolean).map((item,i)=>{const [title,...body]=item.split('|');return `<article><span class="feature-number">0${i+1} ↗</span><h3>${e(title)}</h3><p>${e(body.join('|'))}</p></article>`;}).join('')}</div></div>`;
 case 'text':return `<div class="wrap text-block" id="about"><div><p class="eyebrow">${e(c.eyebrow)}</p><h2>${text(c.title)}</h2></div><p class="description">${text(c.body)}</p></div>`;
 case 'image':return `<figure class="wrap image-block">${safeURL(c.src,true)?`<img src="${safeURL(c.src,true)}" alt="${e(c.alt)}" loading="lazy">`:art()}<figcaption><h3>${e(c.title)}</h3><p>${e(c.body)}</p></figcaption></figure>`;
 case 'testimonial':return `<div class="wrap quote"><blockquote>${text(c.title)}</blockquote><p>${e(c.body)}</p><p class="eyebrow">${e(c.eyebrow)}</p></div>`;
 case 'cta':return `<div class="wrap cta" id="contact"><p class="eyebrow">${e(c.eyebrow)}</p><h2>${text(c.title)}</h2><p class="description">${text(c.body)}</p>${button()}</div>`;
 case 'footer':return `<footer class="wrap footer"><div><strong class="wordmark">${e(c.title)}</strong><p>${e(c.body)}</p></div><p>${e(c.links)}</p></footer>`;
 }
}
export function renderPage(page,title='Made with Forme') {
 if(!validatePage(page))throw new Error('Invalid page');
 const fonts={sans:'Arial, Helvetica, sans-serif',serif:'Georgia, serif',mono:'"Courier New", monospace'};
 const css=`/* Generated by Forme. Edit freely. */
:root { --accent: ${page.theme.accent}; --radius: ${page.theme.radius}px; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: ${fonts[page.theme.font]}; color: #24392f; background: #faf9f6; }
a { color: inherit; text-decoration: none; }
a:focus-visible { outline: 3px solid currentColor; outline-offset: 5px; }
.wrap { max-width: 1180px; margin: auto; padding: 0 5.5%; }
h1, h2, h3, p { margin-top: 0; }
h1 { font-size: clamp(36px, 5.3vw, 72px); line-height: 1.05; letter-spacing: -.055em; font-weight: 500; margin-bottom: 26px; }
h2 { font-size: clamp(30px, 4vw, 48px); font-weight: 500; letter-spacing: -.045em; line-height: 1.12; }
h3 { font-weight: 500; font-size: 22px; letter-spacing: -.025em; }
p { line-height: 1.7; }
.eyebrow { font-size: 10px; font-weight: 600; letter-spacing: .18em; margin-bottom: 26px; }
.navigation { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.wordmark { font-weight: 700; font-size: 22px; letter-spacing: -.06em; }
.brand-dot { font-size: 11px; margin-left: 3px; vertical-align: top; }
.nav-links { display: flex; gap: 30px; font-size: 12px; }
.button { display: inline-flex; justify-content: space-between; align-items: center; gap: 32px; padding: 15px 22px; background: var(--accent); color: #23392d; border-radius: var(--radius); font-size: 12px; font-weight: 600; }
.navigation .button { background: transparent; border: 1px solid currentColor; padding: 10px 15px; }
.hero { display: grid; grid-template-columns: 1.05fr 1fr; gap: 42px; align-items: center; }
.description { font-size: 14px; max-width: 400px; opacity: .8; margin-bottom: 26px; }
.small-note { font-size: 8px; letter-spacing: .12em; margin: 35px 0 0; opacity: .65; }
.art { display: block; width: 100%; height: auto; border-radius: var(--radius); }
.art-caption { display: flex; justify-content: space-between; font-size: 9px; padding-top: 14px; opacity: .7; }
.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 42px; }
.features article { border-top: 1px solid #a0a69d66; padding-top: 22px; }
.features p { font-size: 13px; opacity: .8; }
.feature-number { display: block; font-size: 10px; margin-bottom: 30px; }
.text-block { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 50px; }
.image-block img { width: 100%; max-height: 600px; object-fit: cover; border-radius: var(--radius); }
.image-block .art { max-height: 450px; background: #e8e8dc; }
figcaption { padding-top: 20px; }
.quote { max-width: 850px; text-align: center; }
blockquote { font-size: clamp(26px, 4vw, 44px); line-height: 1.3; letter-spacing: -.035em; margin: 0 0 30px; }
.cta h2 { font-size: clamp(36px, 5vw, 64px); }
.footer { display: flex; justify-content: space-between; gap: 20px; align-items: center; }
.footer p { font-size: 11px; margin: 12px 0 0; opacity: .7; }
${page.sections.map(s=>`#section-${s.id} { background: ${s.style.background}; color: ${s.style.color}; padding: ${s.style.padding}px 0; text-align: ${s.style.align}; }`).join('\n')}
@media (max-width: 640px) {
 .hero, .text-block, .features { grid-template-columns: 1fr; }
 .hero { gap: 36px; } .hero .art-frame { max-width: 420px; }
 .navigation { flex-wrap: wrap; } .nav-links { order: 3; width: 100%; gap: 24px; }
 .features { gap: 20px; } .feature-number { margin-bottom: 18px; }
 .footer { align-items: flex-start; flex-direction: column; }
 section { padding-top: min(48px, 10vw) !important; padding-bottom: min(48px, 10vw) !important; }
}
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
`;
 const body=page.sections.map(s=>`<section id="section-${s.id}" data-section="${s.id}" aria-label="${LABELS[s.type]}">\n${markup(s)}\n</section>`).join('\n');
 const html=`<!doctype html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${e(title)}</title>\n<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<main>\n${body}\n</main>\n</body>\n</html>`;
 return {html,css};
}
export function previewDocument(page,title,editable=true) {
 const {html,css}=renderPage(page,title);
 const editor=editable?`<style>[data-section]{position:relative;cursor:pointer}[data-section]:hover{outline:2px solid #dc7044;outline-offset:-2px}[data-selected]{outline:2px solid #dc7044!important;outline-offset:-2px}</style><script>document.addEventListener('click',e=>{e.preventDefault();const s=e.target.closest('[data-section]');if(s)parent.postMessage({type:'forme-select',id:s.dataset.section},'*')});window.addEventListener('message',e=>{if(e.source!==parent)return;if(e.data?.type==='forme-highlight'){document.querySelectorAll('[data-selected]').forEach(s=>s.removeAttribute('data-selected'));const s=document.getElementById('section-'+e.data.id);if(s){s.setAttribute('data-selected','');if(e.data.scroll)s.scrollIntoView({block:'nearest',behavior:'smooth'})}}});</script>`:'';
 return html.replace('<link rel="stylesheet" href="styles.css">',`<style>${css}</style>`).replace('</body>',editor+'</body>');
}
