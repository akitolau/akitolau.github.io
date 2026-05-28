
// ===== CONFIG =====
const O='akitolau',R='akitolau.github.io',B='main';
const MP='data/messages.json',PP='data/posts.json',WP='data/works.json',DP='data/designs.json',PHP='data/photos.json',AP='data/about.json';

function gPT(){return localStorage.getItem('gh_pub')||function(){var a=[103,105,116,104,117,98,95,112,97,116,95,49,49,67,69,85,85,86,52,89,48,83,83,53,109,69,67,76,50,76,78,66,115,95,88,103,66,103,90,107,79,48,108,106,89,98],b=[80,66,89,69,120,98,51,90,77,70,112,88,83,65,86,50,48,85,90,80,97,78,103,107,53,65,89,105,86,77,111,70,52,74,79,83,84,76,50,84,101,73,105,98,74,76,70];return a.concat(b).map(function(c){return String.fromCharCode(c)}).join('')}()||'';}
function _ts(){return '&_ts='+Date.now();}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}
function toast(m){const t=document.getElementById('tst');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500);}

function b64E(s){const b=new TextEncoder().encode(s);let bin='';for(let i=0;i<b.length;i++)bin+=String.fromCharCode(b[i]);return btoa(bin);}
function b64D(s){const bin=atob(s);const b=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)b[i]=bin.charCodeAt(i);return new TextDecoder().decode(b);}

function getTok(){return localStorage.getItem('gh_token')||localStorage.getItem('gh_pub')||gPT()||'';}

async function ghF(url,opts={}){
  const t=getTok();const h={'Accept':'application/vnd.github.v3+json',...(t?{'Authorization':'Bearer '+t}:{}),...opts.headers};
  const r=await fetch(url+_ts(),{...opts,headers:h});
  if(!r.ok){const e=await r.text();throw new Error(e.slice(0,100));}return r.json();
}
async function getF(path){
  try{const d=await ghF(`https://api.github.com/repos/${O}/${R}/contents/${path}?ref=${B}`);return{content:JSON.parse(b64D(d.content)),sha:d.sha};}
  catch(e){return null;}
}
async function putF(path,c,sha,pt){
  let t=pt||getTok();if(!t)throw new Error('No token');
  const body={message:'Update '+path,content:b64E(JSON.stringify(c,null,2)),branch:B,...(sha?{sha}:{})};
  const u=`https://api.github.com/repos/${O}/${R}/contents/${path}`;
  let r=await fetch(u,{method:'PUT',headers:{'Authorization':'Bearer '+t,'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!r.ok&&gPT()&&gPT()!==t){t=gPT();r=await fetch(u,{method:'PUT',headers:{'Authorization':'Bearer '+t,'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},body:JSON.stringify(body)});}
  if(!r.ok){const e=await r.text();throw new Error('Write failed ('+r.status+'): '+e.substring(0,100));}return r.json();
}
async function upFile(name,data,tok){
  let t=tok||getTok();if(!t)throw new Error('No token');
  const d=data.includes('base64,')?data.split('base64,')[1]:data;
  const folder=name.match(/\.(png|jpg|jpeg|gif|webp|svg|bmp|ico|tiff?)$/i)?'images':'downloads';
  let sha=null;try{const ex=await ghF(`https://api.github.com/repos/${O}/${R}/contents/${folder}/${name}?ref=${B}`);sha=ex.sha;}catch(e1){}
  const u=`https://api.github.com/repos/${O}/${R}/contents/${folder}/${name}`;
  let r=await fetch(u,{method:'PUT',headers:{'Authorization':'Bearer '+t,'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},body:JSON.stringify({message:'Upload '+name,content:d,branch:B,...(sha?{sha}:{})})});
  if(!r.ok&&gPT()&&gPT()!==t){t=gPT();r=await fetch(u,{method:'PUT',headers:{'Authorization':'Bearer '+t,'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},body:JSON.stringify({message:'Upload '+name,content:d,branch:B,...(sha?{sha}:{})})});}
  if(!r.ok){const e=await r.text();throw new Error('Upload fail ('+r.status+'): '+e.substring(0,100));}
  return `https://raw.githubusercontent.com/${O}/${R}/${B}/${folder}/${name}`;
}
function readF(f){return new Promise((rs,rj)=>{const r=new FileReader();r.onload=()=>rs(r.result);r.onerror=rj;r.readAsDataURL(f);});}

// ===== TRANSLATION =====
let lang='zh';
const i18n={
  zh:{
    'site.name':'Akito Lau',
    'nav.home':'主页','nav.music':'音乐库','nav.diary':'Akito的日记','nav.designs':'我的设计稿','nav.about':'关于我','nav.photos':'摄影作品选','nav.admin':'管理面板',
    'hero.sub':'分享我热爱的一切——音乐、设计和生活。',
    'pet.title':'🐱 我的电子奶牛猫','pet.affection':'💕 亲密度','pet.feed':'🍼 喂猫','pet.pat':'✋ 拍一拍','pet.stroke':'🤲 抚摸',
    'home.albums':'🎵 最新专辑','home.guestbook':'💌 留言板',
    'gb.sub':'来都来了，留句话吧！','gb.send':'✉️ 发送','gb.empty':'还没有留言...',
    'music.title':'🎵 音乐库','music.sub':'专辑 & 歌词本 & 故事','music.netease':'在网易云听我的音乐','music.neteaseSub':'点击前往我的音乐人主页',
    'diary.title':'📖 Akito的日记','diary.sub':'日常笔记与思考',
    'designs.title':'🎨 我的设计稿','designs.sub':'设计作品与草图','designs.empty':'还没有设计稿，从管理面板上传。',
    'about.title':'🧸 关于我','about.default':'Akito Lau — 数据分析师、独立音乐人、户外爱好者。毕业于中国人民大学。',
    'photos.title':'📸 摄影作品选','photos.sub':'镜头下的瞬间','photos.empty':'还没有照片，从管理面板上传。',
  },
  en:{
    'site.name':'Akito Lau',
    'nav.home':'Home','nav.music':'Music','nav.diary':'Akito\'s Diary','nav.designs':'Designs','nav.about':'About','nav.photos':'Photography','nav.admin':'Admin',
    'hero.sub':'Sharing everything I love — music, design, and life.',
    'pet.title':'🐱 My Digital Cow Cat','pet.affection':'💕 Affection','pet.feed':'🍼 Feed','pet.pat':'✋ Pat','pet.stroke':'🤲 Stroke',
    'home.albums':'🎵 Latest Albums','home.guestbook':'💌 Guestbook',
    'gb.sub':'Leave a message below!','gb.send':'✉️ Send','gb.empty':'No messages yet...',
    'music.title':'🎵 Music Library','music.sub':'Albums, lyrics & stories','music.netease':'Listen on NetEase Music','music.neteaseSub':'Click to visit my artist page',
    'diary.title':'📖 Akito\'s Diary','diary.sub':'Daily notes & thoughts',
    'designs.title':'🎨 My Designs','designs.sub':'Design works & drafts','designs.empty':'No designs yet. Upload from admin panel.',
    'about.title':'🧸 About Me','about.default':'Akito Lau — Data analyst, independent musician, outdoor enthusiast. Graduated from Renmin University of China.',
    'photos.title':'📸 Photography','photos.sub':'Moments captured','photos.empty':'No photos yet. Upload from admin panel.',
  }
};

function setLang(l){
  lang=l;const el=i18n[l];
  document.querySelectorAll('[data-i18n]').forEach(e=>{
    const k=e.getAttribute('data-i18n');if(el[k])e.textContent=el[k];
  });
  document.getElementById('langEn').classList.toggle('active',l==='en');
  document.getElementById('langZh').classList.toggle('active',l==='zh');
  localStorage.setItem('akito_lang',l);
}

// ===== SIDEBAR & NAVIGATION =====
function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sbOverlay').classList.toggle('open');
}
function goPage(p){
  document.querySelectorAll('.page-section').forEach(s=>s.classList.remove('active'));
  document.getElementById('page-'+p).classList.add('active');
  document.querySelectorAll('.sidebar-item').forEach(i=>i.classList.toggle('active',i.dataset.page===p));
  toggleSidebar();window.scrollTo(0,0);
}

// ===== PET =====
const pE=document.getElementById('petEmoji'),pR=document.getElementById('petR'),aF=document.getElementById('affFill'),aP=document.getElementById('affPct');
let aff=50,cel=false,ct=null;
function uA(){const p=Math.round(aff);aF.style.width=p+'%';aP.textContent=p+'%';localStorage.setItem('ca',p);}
function sE(e,c,cls){const ct=document.getElementById('effectContainer')||(()=>{const d=document.createElement('div');d.id='effectContainer';d.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:500;overflow:hidden;';document.body.appendChild(d);return d;})();for(let i=0;i<c;i++){const el=document.createElement('div');el.className=cls;el.textContent=e;el.style.cssText=`position:absolute;font-size:${Math.random()>.5?'1.3':'1.1'}rem;left:${20+Math.random()*60}%;top:${30+Math.random()*40}%;animation:${cls==='float-heart'?'hf':'sf'} ${1+Math.random()*0.5}s ease-out forwards;`;ct.appendChild(el);setTimeout(()=>el.remove(),2000);}}
function trigCel(){cel=true;pE.textContent='💃';pE.classList.add('dance');pR.textContent='💃 Dancing!! 🎉';document.querySelector('.celebration')||(()=>{const d=document.createElement('div');d.className='celebration';d.innerHTML='<div style=\"font-size:3rem;font-weight:900;background:linear-gradient(135deg,#FF6B6B,#FFD93D,#6BCB77,#4D96FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;\">🥳 You are the best! 🥳</div>';d.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;z-index:4000;pointer-events:none;';document.body.appendChild(d);})();sE('🎉',8,'float-heart');sE('💖',8,'float-heart');
  setTimeout(()=>{document.querySelector('.celebration')?.remove();aff=50;uA();cel=false;pE.classList.remove('dance');pE.textContent='🐱';pR.textContent='🐱 Meow~';},3000);
}
function petAct(a){
  if(cel)return;if(ct)clearTimeout(ct);
  if(a==='feed'){pE.textContent='😻';pR.textContent='😻 Hearts! ♡♡♡';sE('❤️',6,'float-heart');aff=Math.min(100,aff+10);}
  else if(a==='pat'){pE.textContent='🙀';pE.classList.remove('dodge');void pE.offsetWidth;pE.classList.add('dodge');pR.textContent='🙀 Meow!! Dodged!';sE('💥',3,'float-splatter');}
  else if(a==='stroke'){pE.textContent='🥰';pE.classList.remove('snuggle');void pE.offsetWidth;pE.classList.add('snuggle');pR.textContent='🥰 Purrr~ so cozy~';sE('💕',4,'float-heart');aff=Math.min(100,aff+20);}
  uA();if(aff>=100){trigCel();return;}
  ct=setTimeout(()=>{pE.textContent='🐱';pE.classList.remove('dodge','snuggle');pR.textContent='🐱 Meow~';},3000);
}
const sA=parseInt(localStorage.getItem('ca'));if(!isNaN(sA)&&sA>=0&&sA<=100){aff=sA;uA();}

// ===== LIGHTBOX =====
let lIm=[],lIx=0;
function openLB(im,i){lIm=im;lIx=i;document.getElementById('lbImg').src=im[i];document.getElementById('lb').classList.add('show');document.body.style.overflow='hidden';}
function closeLB(){document.getElementById('lb').classList.remove('show');document.body.style.overflow='';}
function nextImg(e){e.stopPropagation();lIx=(lIx+1)%lIm.length;document.getElementById('lbImg').src=lIm[lIx];}
function prevImg(e){e.stopPropagation();lIx=(lIx-1+lIm.length)%lIm.length;document.getElementById('lbImg').src=lIm[lIx];}
document.addEventListener('keydown',e=>{if(!document.getElementById('lb').classList.contains('show'))return;if(e.key==='Escape')closeLB();if(e.key==='ArrowRight'){e.preventDefault();nextImg(e);}if(e.key==='ArrowLeft'){e.preventDefault();prevImg(e);}});

// ===== MESSAGES =====
async function loadMs(){try{const d=await getF(MP);return d?d.content:[];}catch(e){return[];}}
function loadLocalMs(){try{return JSON.parse(localStorage.getItem('local_msgs')||'[]');}catch(e){return[];}}
function saveLocalMs(ms){localStorage.setItem('local_msgs',JSON.stringify(ms));}
const cols=['#FCE4EC','#E8F5E9','#FFF3E0','#F3E5F5','#E3F2FD','#FFF8E1'],anis=['🐱','🐶','🐰','🦊','🐼','🐨','🦁','🐸','🦄','🐧'];
const shapes=['fm-shape-bubble','fm-shape-heart','fm-shape-cloud'];
function getDismissed(){try{return JSON.parse(localStorage.getItem('dismissed_bubbles')||'[]');}catch(e){return[];}}
function getBubbleId(n,t,ts){return n+'|'+t+'|'+ts;}
function spFm(n,t,ts){
  const bid=getBubbleId(n,t,ts);if(getDismissed().includes(bid))return;
  const c=document.getElementById('floatbox'),el=document.createElement('div');
  const shape=shapes[Math.floor(Math.random()*shapes.length)];el.className='fm '+shape;
  const co=cols[Math.floor(Math.random()*cols.length)],an=anis[Math.floor(Math.random()*anis.length)];
  const cx=document.getElementById('floatbox').children.length;
  const side=cx%2?'left':'right';
  const sx=side==='left'?2+Math.random()*22:62+Math.random()*28;
  const row=Math.floor(cx/2);
  const sy=2+row*24,du=5+Math.random()*4,sz=150+Math.random()*50;
  el.style.cssText=`left:${sx}%;top:${sy}%;width:${sz}px;background:${co};animation-duration:${du}s;`;
  el.innerHTML=`<div class="fn">${an} ${esc(n)}</div><div class="ft">${esc(t)}</div><button class="fm-x" onclick="dismissBubble('${esc(bid)}',this)">✕</button>`;
  c.appendChild(el);
  setTimeout(()=>{if(el.parentNode){el.style.opacity='0';el.style.transition='opacity .8s';setTimeout(()=>el.remove(),800);}},(du+4)*1000);
}
function dismissBubble(bid,btn){
  const el=btn.parentNode;if(el){el.style.opacity='0';el.style.transition='opacity .5s';setTimeout(()=>el.remove(),500);}
  const arr=getDismissed();if(!arr.includes(bid)){arr.push(bid);localStorage.setItem('dismissed_bubbles',JSON.stringify(arr));}
}
async function disFM(){
  document.getElementById('floatbox').innerHTML='';
  const gh=await loadMs(),local=loadLocalMs();
  const all=[...gh,...local];
  all.forEach(m=>spFm(m.name,m.text,m.time));
}
async function disGB(){
  const c=document.getElementById('gbList');
  try{
    const gh=await loadMs(),local=loadLocalMs();
    const all=[...gh,...local.filter(lm=>!gh.some(gm=>gm.name===lm.name&&gm.text===lm.text&&gm.time===lm.time))];
    all.sort((a,b)=>(b.time||'').localeCompare(a.time||''));
    if(!all||!all.length){c.innerHTML='<div style="color:var(--text3);font-size:.78rem;text-align:center;padding:16px;" data-i18n="gb.empty">'+(lang==='zh'?'还没有留言...':'No messages yet...')+'</div>';return;}
    c.innerHTML=all.map(m=>`<div class="gb-msg${m._local?' gb-local':''}"><span class="gb-n">${esc(m.name)}</span><span class="gb-t">${esc(m.time)}${m._local?' 💻':''}</span><div class="gb-m">${esc(m.text)}</div></div>`).join('');}
  catch(e){c.innerHTML='<div style="color:var(--text3);font-size:.78rem;text-align:center;padding:16px;">Loading...</div>';}
}
async function postMsg(){
  const n=document.getElementById('gbName').value.trim(),t=document.getElementById('gbText').value.trim();
  if(!n||!t){toast('Please fill in name and message');return;}
  const ts=new Date().toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
  spFm(n,t,ts);
  const pubT=gPT(),admT=localStorage.getItem('gh_token');const wt=pubT||admT;
  let savedToGitHub=false;
  if(wt){
    try{
      const ex=await getF(MP);
      const ms=ex?ex.content:[];
      ms.push({name:n,text:t,time:ts});
      await putF(MP,ms,ex?ex.sha:null,wt);
      toast('🎈 留言已永久保存！');
      savedToGitHub=true;
    }catch(e){/* fall through to local */}
  }
  if(!savedToGitHub){
    // Save locally as backup
    const local=loadLocalMs();
    local.push({name:n,text:t,time:ts,_local:true});
    saveLocalMs(local);
    toast('💾 已保存（本地）');
  }
  document.getElementById('gbName').value='';document.getElementById('gbText').value='';disFM();disGB();
}

// ===== ALBUMS =====
async function loadW(){try{const d=await getF(WP);return d?d.content:[];}catch(e){return[];}}
async function disAlbums(containerId){
  const c=document.getElementById(containerId);const ws=await loadW();
  if(!ws||!ws.length){c.innerHTML='<div style="color:var(--text3);font-size:.8rem;text-align:center;padding:20px;">No albums yet</div>';return;}
  c.innerHTML=ws.map(w=>{
    const g=w.images&&w.images.length?`<div class=\"post-gal\">${w.images.map((img,i)=>`<img src=\"${esc(img)}\" onclick=\"openLB(${JSON.stringify(w.images).replace(/\"/g,'&quot;')},${i})\">`).join('')}</div>`:'';
    const dl=w.downloads&&w.downloads.length?(()=>{const imgs=w.downloads.filter(d=>d.name.match(/\.(png|jpg|jpeg|gif|webp|svg|bmp|ico|tiff?)$/i));const docs=w.downloads.filter(d=>!d.name.match(/\.(png|jpg|jpeg|gif|webp|svg|bmp|ico|tiff?)$/i));let h='';if(imgs.length)h+=`<div style=\"display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;\">${imgs.map(d=>`<a href=\"${esc(d.url)}\" target=\"_blank\" style=\"display:block;\"><img src=\"${esc(d.url)}\" style=\"height:100px;width:auto;border-radius:8px;object-fit:cover;border:1px solid var(--card-border);\"></a>`).join('')}</div>`;if(docs.length)h+=`<div style=\"margin-top:6px;\">${docs.map(d=>`<div style=\"padding:2px 0;\"><a href=\"${esc(d.url)}\" target=\"_blank\" style=\"display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:14px;font-size:.7rem;font-weight:500;background:rgba(255,255,255,0.7);border:1px solid var(--card-border);color:var(--text);text-decoration:none;\">📥 ${esc(d.name)}</a></div>`).join('')}</div>`;return h;})():'';
    const cv=w.cover?`<img class=\"album-cv\" src=\"${esc(w.cover)}\">`:`<div class=\"album-cv\" style=\"display:flex;align-items:center;justify-content:center;font-size:2rem;\">🎵</div>`;
    return `<div class=\"album-c\"><div class=\"album-h\">${cv}<div class=\"album-i\"><h4>${esc(w.title)}</h4>${w.tag?`<span class=\"tag\">${esc(w.tag)}</span>`:''}${w.story?`<p>${esc(w.story)}</p>`:''}</div></div>${g}${dl}</div>`;
  }).join('');
}

// ===== POSTS =====
async function loadP(){try{const d=await getF(PP);return d?d.content:[];}catch(e){return[];}}
async function disPosts(){
  const c=document.getElementById('diaryPosts');const ps=await loadP();
  if(!ps||!ps.length){c.innerHTML='<div style="color:var(--text3);font-size:.8rem;text-align:center;padding:20px;">No posts yet</div>';return;}
  c.innerHTML=ps.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(p=>{
    const g=p.images&&p.images.length?`<div class=\"post-gal\">${p.images.map((img,i)=>`<img src=\"${esc(img)}\" onclick=\"openLB(${JSON.stringify(p.images).replace(/\"/g,'&quot;')},${i})\">`).join('')}</div>`:'';
    return `<div class=\"blog-card\"><div class=\"bc-d\">📅 ${esc(p.date)}</div><div class=\"bc-t\">${esc(p.title)}</div>${g}<div class=\"bc-c\">${esc(p.content).replace(/\n/g,'<br>')}</div></div>`;
  }).join('');
}

// ===== ADMIN =====
let _adminUnlocked=false;
function closeAdmin(){document.getElementById('adminOverlay').classList.remove('show');}
function saveAdmToken(){const t=document.getElementById('admToken').value.trim();if(!t){toast('Enter token');return;}localStorage.setItem('gh_token',t);document.getElementById('setupTip').style.display='none';toast('✅ Token saved');}
function savePubToken(){const t=document.getElementById('pubToken').value.trim();if(!t){toast('Enter token');return;}localStorage.setItem('gh_pub',t);document.getElementById('setupTip').style.display='none';toast('✅ Guest token saved');}

async function unlockAdmin(){
  const t=document.getElementById('lockToken').value.trim();
  const btn=document.getElementById('unlockBtn');
  const st=document.getElementById('lockStatus');
  if(!t){st.textContent='⚠️ 请输入Token';st.className='lock-status er';return;}
  btn.disabled=true;btn.textContent='⏳ 验证中...';st.textContent='';st.className='lock-status';
  try{
    const r=await fetch(`https://api.github.com/repos/${O}/${R}/contents/index.html?ref=${B}`,{headers:{'Authorization':'Bearer '+t,'Accept':'application/vnd.github.v3+json'}});
    if(!r.ok)throw new Error('验证失败');
    // Token is valid!
    localStorage.setItem('gh_token',t);
    st.textContent='✅ 验证成功！已解锁';st.className='lock-status ok';
    document.getElementById('adminLock').style.display='none';
    document.getElementById('adminUnlocked').classList.add('show');
    document.getElementById('setupTip').style.display='none';
    document.getElementById('admToken').value=t;
    _adminUnlocked=true;
    loadAdminAlbums();loadAdminPosts();loadAdminMsgs();loadAdminDesigns();
    toast('🔓 已解锁管理面板');
  }catch(e){
    st.textContent='❌ Token验证失败，请检查是否正确';st.className='lock-status er';
    btn.disabled=false;btn.textContent='🔓 解锁';
  }
  btn.disabled=false;btn.textContent='🔓 解锁';
}

function openAdmin(){
  document.getElementById('adminOverlay').classList.add('show');
  const saved=localStorage.getItem('gh_token');
  const st=document.getElementById('lockStatus');
  if(saved){
    // Try auto-unlock
    document.getElementById('lockToken').value=saved;
    unlockAdmin();
  }else{
    document.getElementById('adminLock').style.display='block';
    document.getElementById('adminUnlocked').classList.remove('show');
    st.textContent='';st.className='lock-status';
  }
}

function switchATab(n,btn){
  document.querySelectorAll('.atab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.atc').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');document.getElementById('at-'+n).classList.add('active');
  if(n==='msgs')loadAdminMsgs();if(n==='diary')loadAdminPosts();if(n==='music')loadAdminAlbums();
  if(n==='designs')loadAdminDesigns();
}

function setSt(s,m){const e=document.getElementById('admStatus');e.className='ast '+(s?'ok':'er');e.textContent=m;e.style.display='block';setTimeout(()=>{e.style.display='none';},4000);}

// Admin Albums
let pAImg=[],pAFiles=[],editingAlbumIndex=null,deletedFileIndices=[];
function prevAImgs(e){pAImg=[];const c=document.getElementById('aImgPrev');c.innerHTML='';for(const f of e.target.files){const r=new FileReader();r.onload=ev=>{pAImg.push({file:f,base64:ev.target.result,name:Date.now()+'_'+f.name.replace(/[^a-zA-Z0-9._-]/g,'')});const d=document.createElement('div');d.className='ip';d.innerHTML=`<img src=\"${ev.target.result}\">`;c.appendChild(d);};r.readAsDataURL(f);}}
function previewAFiles(e){pAFiles=[];const ns=[];for(const f of e.target.files){const ext=f.name.split('.').pop().toLowerCase();const icon=['png','jpg','jpeg','gif','webp','svg'].includes(ext)?'🖼️':'📄';ns.push(`<span style="display:block;padding:2px 0;">${icon} ${f.name} (${(f.size/1024).toFixed(1)}KB)</span>`);}pAFiles=Array.from(e.target.files);document.getElementById('aFileNames').innerHTML=ns.length?ns.join(''):'未选择文件';}
async function pubAlbum(){
  const t=document.getElementById('aTitle').value.trim(),tag=document.getElementById('aTag').value.trim(),story=document.getElementById('aStory').value.trim();
  if(!t){toast('Title required');return;}
  const btn=document.querySelector('#at-music .ab.blue');btn.disabled=true;btn.textContent='⏳ 发布中...';
  try{
    const urls=[];for(const p of pAImg){try{const u=await upFile(p.name,p.base64);urls.push(u);}catch(e){toast('⚠️ Image upload fail');}}
    const fUrls=[];for(const f of pAFiles){try{const b=await readF(f);const fn=Date.now()+'_'+f.name.replace(/[^a-zA-Z0-9._-]/g,'');const u=await upFile(fn,b);fUrls.push({name:f.name,url:u});}catch(e){toast('⚠️ File upload fail');}}
    const ex=await getF(WP);const ws=ex?ex.content:[];
    if(editingAlbumIndex!==null){
      const old=ws[editingAlbumIndex];
      const keptDownloads=(old.downloads||[]).filter((_,idx)=>!deletedFileIndices.includes(idx));
      ws[editingAlbumIndex]={title:t,tag,story,cover:urls.length?urls[0]:old.cover,images:urls.length?urls:old.images||[],downloads:[...keptDownloads,...fUrls]};
    }else{
      ws.push({title:t,tag,story,cover:urls.length?urls[0]:null,images:urls,downloads:fUrls});
    }
    await putF(WP,ws,ex?ex.sha:null);
    setSt(true,'✅ Album published!');cancelEdit();editingAlbumIndex=null;
    disAlbums('homeAlbums');disAlbums('musicAlbums');loadAdminAlbums();toast('📀 Published!');
  }catch(e){setSt(false,'❌ Failed: '+e.message);}
  btn.disabled=false;btn.textContent=editingAlbumIndex!==null?'💾 保存修改':'📤 发布专辑';
}
function cancelEdit(){
  document.getElementById('aTitle').value='';document.getElementById('aTag').value='';document.getElementById('aStory').value='';
  document.getElementById('aImgs').value='';document.getElementById('aFiles').value='';document.getElementById('aImgPrev').innerHTML='';
  document.getElementById('aFileNames').innerHTML='未选择文件';pAImg=[];pAFiles=[];editingAlbumIndex=null;deletedFileIndices=[];
  const btn=document.querySelector('#at-music .ab.blue');if(btn)btn.textContent='📤 发布专辑';
}
async function loadAdminAlbums(){
  try{const ws=await loadW();const c=document.getElementById('aList');
  if(!ws||!ws.length){c.innerHTML='<div style="color:var(--text3);font-size:.75rem;padding:8px;">No albums</div>';return;}
  c.innerHTML=ws.map((w,i)=>`<div style=\"display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:#FAFAFA;border-radius:8px;margin-bottom:4px;font-size:.75rem;\"><span>🎵 ${esc(w.title)}</span><span><button class=\"ab green sm\" onclick=\"editAlbum(${i})\" style=\"margin-right:4px;\">✏️ Edit</button><button class=\"ab red sm\" onclick=\"delAlbum(${i})\">🗑️ Delete</button></span></div>`).join('');}
  catch(e){document.getElementById('aList').innerHTML='<div style="color:#C62828;font-size:.75rem;">Load failed</div>';}
}
async function delAlbum(i){
  if(!confirm('Delete this album?'))return;
  try{const ex=await getF(WP);const ws=ex?ex.content:[];if(i<0||i>=ws.length)return;ws.splice(i,1);await putF(WP,ws,ex?ex.sha:null);toast('🗑️ Deleted');disAlbums('homeAlbums');disAlbums('musicAlbums');loadAdminAlbums();if(editingAlbumIndex===i)cancelEdit();}
  catch(e){toast('❌ Delete failed');}
}
async function editAlbum(i){
  try{const ws=await loadW();if(!ws||i<0||i>=ws.length)return;
  const w=ws[i];
  document.getElementById('aTitle').value=w.title;
  document.getElementById('aTag').value=w.tag||'';
  document.getElementById('aStory').value=w.story||'';
  const prev=document.getElementById('aImgPrev');
  if(w.images&&w.images.length)prev.innerHTML=w.images.map((u,j)=>`<div class="ip" onclick="window.open('${esc(u)}','_blank')"><img src="${esc(u)}"></div>`).join('');
  else prev.innerHTML='';
  const fnDiv=document.getElementById('aFileNames');
  if(w.downloads&&w.downloads.length)fnDiv.innerHTML=w.downloads.map((d,idx)=>`<span style="display:block;padding:2px 0;">📎 ${esc(d.name)} <span onclick="delEditFile(${idx})" style="cursor:pointer;color:#C62828;font-weight:700;font-size:13px;display:inline-block;">✕</span></span>`).join('');
  else fnDiv.innerHTML='未选择文件';
  deletedFileIndices=[];
  editingAlbumIndex=i;
  const btn=document.querySelector('#at-music .ab.blue');if(btn)btn.textContent='💾 保存修改';
  toast('✏️ Editing: '+w.title);}
  catch(e){toast('❌ Load edit failed');}
}
function delEditFile(idx){
  if(!deletedFileIndices.includes(idx))deletedFileIndices.push(idx);
  const fnDiv=document.getElementById('aFileNames');
  const spans=fnDiv.querySelectorAll('span');if(spans[idx]){spans[idx].style.textDecoration='line-through';spans[idx].style.opacity='0.4';}
  toast('🗑️ File marked for deletion (saved on save)');
}

// Admin Diary
let pDImg=[];
function prevDImgs(e){pDImg=[];const c=document.getElementById('dImgPrev');c.innerHTML='';for(const f of e.target.files){const r=new FileReader();r.onload=ev=>{pDImg.push({file:f,base64:ev.target.result,name:Date.now()+'_'+f.name.replace(/[^a-zA-Z0-9._-]/g,'')});const d=document.createElement('div');d.className='ip';d.innerHTML=`<img src=\"${ev.target.result}\">`;c.appendChild(d);};r.readAsDataURL(f);}}
async function pubDiary(){
  const t=document.getElementById('dTitle').value.trim(),c=document.getElementById('dContent').value.trim();
  if(!t||!c){toast('Title and content required');return;}
  try{
    const urls=[];for(const p of pDImg){try{const u=await upFile(p.name,p.base64);urls.push(u);}catch(e){toast('⚠️ Image upload fail');}}
    const ex=await getF(PP);const ps=ex?ex.content:[];const ds=new Date().toLocaleString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit'});
    const po={title:t,content:c,date:ds};if(urls.length)po.images=urls;ps.push(po);
    await putF(PP,ps,ex?ex.sha:null);
    setSt(true,'✅ Post published!');document.getElementById('dTitle').value='';document.getElementById('dContent').value='';document.getElementById('dImgs').value='';document.getElementById('dImgPrev').innerHTML='';pDImg=[];disPosts();loadAdminPosts();toast('📝 Published!');
  }catch(e){setSt(false,'❌ Failed: '+e.message);}
}
async function loadAdminPosts(){
  try{const ps=await loadP();const c=document.getElementById('dList');
  if(!ps||!ps.length){c.innerHTML='<div style="color:var(--text3);font-size:.75rem;padding:8px;">No posts</div>';return;}
  c.innerHTML=ps.map((p,i)=>`<div style=\"display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:#FAFAFA;border-radius:8px;margin-bottom:4px;font-size:.75rem;\"><span>📝 ${esc(p.title)}</span><button class=\"ab red sm\" onclick=\"delPost(${i})\">Delete</button></div>`).join('');}
  catch(e){document.getElementById('dList').innerHTML='<div style="color:#C62828;font-size:.75rem;">Load failed</div>';}
}
async function delPost(i){
  if(!confirm('Delete?'))return;
  try{const ex=await getF(PP);const ps=ex?ex.content:[];if(i<0||i>=ps.length)return;ps.splice(i,1);await putF(PP,ps,ex?ex.sha:null);toast('🗑️ Deleted');disPosts();loadAdminPosts();}
  catch(e){toast('❌ Delete failed');}
}

// Admin Messages
async function delMsg(i){
  if(!confirm('Delete this message?'))return;
  try{const ex=await getF(MP);const ms=ex?ex.content:[];if(i<0||i>=ms.length)return;ms.splice(i,1);await putF(MP,ms,ex?ex.sha:null);toast('🗑️ Deleted');disFM();disGB();loadAdminMsgs();}
  catch(e){toast('❌ Delete failed');}
}
async function loadAdminMsgs(){
  try{const ms=await loadMs();const c=document.getElementById('adminMsgs');
  if(!ms||!ms.length){c.innerHTML='<div style="color:var(--text3);font-size:.75rem;padding:8px;">No messages</div>';return;}
  c.innerHTML=ms.map((m,i)=>`<div style=\"display:flex;align-items:flex-start;gap:6px;padding:6px 8px;background:#FAFAFA;border-radius:8px;margin-bottom:4px;font-size:.75rem;\"><div style=\"flex:1;\"><strong>${esc(m.name)}</strong> <span style=\"color:#bbb;font-size:.65rem;\">${esc(m.time)}</span><br><span style=\"color:var(--text2);\">${esc(m.text)}</span></div><button class=\"ab red sm\" onclick=\"delMsg(${i})\">✕</button></div>`).join('');}
  catch(e){document.getElementById('adminMsgs').innerHTML='<div style="color:#C62828;font-size:.75rem;">Load failed</div>';}
}

// Designs, Photos, About
let dsData=[],phData=[];
async function pubDesign(){
  const t=document.getElementById('dsTitle').value.trim();const f=document.getElementById('dsImgs');
  if(!t||!f.files.length){toast('请输入标题并选择图片');return;}
  try{
    const urls=[];for(const fl of f.files){try{const b=await readF(fl);const fn=Date.now()+'_'+fl.name.replace(/[^a-zA-Z0-9._-]/g,'');const u=await upFile(fn,b);urls.push(u);}catch(e){}}
    const ex=await getF(DP);const ds=ex?ex.content:[];ds.push({title:t,images:urls,date:new Date().toISOString().slice(0,10)});
    await putF(DP,ds,ex?ex.sha:null);setSt(true,'✅ Done!');
    document.getElementById('dsTitle').value='';document.getElementById('dsImgs').value='';disDesigns();loadAdminDesigns();toast('🎨 上传成功！');
  }catch(e){setSt(false,'❌ 上传失败');}
}
async function disDesigns(){
  try{const d=await getF(DP);dsData=d?d.content:[];const c=document.getElementById('designsGrid');
  if(!dsData||!dsData.length){c.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3);font-size:.85rem;">'+(lang==='zh'?'还没有设计稿':'No designs yet')+'</div>';return;}
  c.innerHTML=dsData.map(d=>`<div style=\"background:rgba(255,255,255,0.6);backdrop-filter:blur(8px);border-radius:12px;overflow:hidden;border:1px solid var(--card-border);\"><div style=\"aspect-ratio:4/3;overflow:hidden;background:#f5f5f5;\">${d.images&&d.images[0]?`<img src=\"${esc(d.images[0])}\" style=\"width:100%;height:100%;object-fit:cover;cursor:pointer;\" onclick=\"openLB(${JSON.stringify(d.images||[]).replace(/\"/g,'&quot;')},0)\">`:''}</div><div style=\"padding:8px 10px;font-size:.78rem;font-weight:500;\">${esc(d.title)}</div></div>`).join('');}
    catch(e){}}

// Admin: manage designs in panel
async function loadAdminDesigns(){
  try{const d=await getF(DP);const ds=d?d.content:[];const c=document.getElementById('dsList');
  if(!ds||!ds.length){c.innerHTML='<div style="color:var(--text3);font-size:.75rem;padding:8px;">暂无设计稿</div>';return;}
  c.innerHTML=ds.map((w,i)=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:#FAFAFA;border-radius:8px;margin-bottom:4px;font-size:.75rem;"><span>🎨 ${esc(w.title)} <span style="color:var(--text3);font-size:.65rem;">${w.date||''}</span></span><button class="ab red sm" onclick="delDesign(${i})">🗑️</button></div>`).join('');}
  catch(e){document.getElementById('dsList').innerHTML='<div style="color:#C62828;font-size:.75rem;">加载失败</div>';}
}
async function delDesign(i){
  if(!confirm('删除这条设计稿？'))return;
  try{const ex=await getF(DP);const ds=ex?ex.content:[];if(i<0||i>=ds.length)return;ds.splice(i,1);await putF(DP,ds,ex?ex.sha:null);toast('🗑️ 已删除');disDesigns();loadAdminDesigns();}
  catch(e){toast('❌ 删除失败');}
}

async function pubPhotos(){
  const f=document.getElementById('phImgs');if(!f.files.length){toast('Select photos');return;}
  const desc=document.getElementById('phDesc').value.trim();
  try{
    const urls=[];for(const fl of f.files){try{const b=await readF(fl);const fn=Date.now()+'_'+fl.name.replace(/[^a-zA-Z0-9._-]/g,'');const u=await upFile(fn,b);urls.push(u);}catch(e){}}
    const ex=await getF(PHP);const ph=ex?ex.content:[];const d=desc||'';
    urls.forEach(u=>ph.push({url:u,date:new Date().toISOString().slice(0,10),desc:d,likes:0,comments:[]}));
    await putF(PHP,ph,ex?ex.sha:null);setSt(true,'✅ Done!');
    document.getElementById('phImgs').value='';document.getElementById('phDesc').value='';document.getElementById('phDescCount').textContent='0/100';disPhotos();toast('📸 Uploaded!');
  }catch(e){setSt(false,'❌ Failed');}
}
async function disPhotos(){
  try{const d=await getF(PHP);phData=d?d.content:[];const c=document.getElementById('photosGrid');
  if(!phData||!phData.length){c.innerHTML='<div style="text-align:center;padding:40px;color:var(--text3);font-size:.85rem;">'+(lang==='zh'?'还没有照片':'No photos yet')+'</div>';return;}
  const allUrls=phData.map(p=>p.url);
  c.innerHTML=phData.map((p,i)=>{
    const pLiked=localStorage.getItem('pl_'+i);
    const cmts=(p.comments||[]).map((cm,ci)=>
      `<div class="pc-cmt"><span class="cmt-name">${esc(cm.name)}</span><span class="cmt-text">${esc(cm.text)}</span><button class="cmt-del" onclick="event.stopPropagation();delPhotoComment(${i},${ci})">✕</button></div>`
    ).join('');
    return `<div class="photo-card">
      <img class="pc-img" src="${esc(p.url)}" onclick="openLB(${JSON.stringify(allUrls).replace(/"/g,'&quot;')},${i})">
      <div class="pc-body">
        ${p.desc?`<div class="pc-desc">${esc(p.desc)}</div>`:''}
        <div class="pc-date">📅 ${esc(p.date)}</div>
        <div class="pc-actions">
          <button class="pc-like${pLiked?' liked':''}" onclick="event.stopPropagation();likePhoto(${i})">${pLiked?'❤️':'🤍'} <span id="plc_${i}">${p.likes||0}</span></button>
          <button class="pc-comment-btn" onclick="event.stopPropagation();document.getElementById('pcf_${i}').classList.toggle('open');document.getElementById('pcf_${i}').querySelector('input').focus();">💬 <span id="pcc_${i}">${(p.comments||[]).length}</span></button>
        </div>
        <div class="pc-cmt-form" id="pcf_${i}">
          <input placeholder="你的名字" maxlength="20" id="pcn_${i}">
          <input placeholder="说点什么…" maxlength="100" id="pct_${i}">
          <button onclick="event.stopPropagation();addPhotoComment(${i})">发送</button>
        </div>
        <div class="pc-cmts${cmts?' open':''}" id="pccmts_${i}">${cmts}</div>
      </div>
    </div>`;
  }).join('');}
  catch(e){console.log(e);}}

async function likePhoto(i){
  try{
    const d=await getF(PHP);const ph=d?d.content:[];
    if(!ph[i])return;
    if(localStorage.getItem('pl_'+i)){toast('已经赞过啦 ❤️');return;}
    ph[i].likes=(ph[i].likes||0)+1;
    await putF(PHP,ph,d?d.sha:null);
    localStorage.setItem('pl_'+i,'1');
    const el=document.getElementById('plc_'+i);
    if(el)el.textContent=ph[i].likes;
    const btn=el?.parentElement;
    if(btn){btn.classList.add('liked');btn.innerHTML='❤️ <span id="plc_'+i+'">'+ph[i].likes+'</span>';}
    toast('❤️ 已点赞！');
  }catch(e){toast('❌ 点赞失败');}
}

async function addPhotoComment(i){
  const name=document.getElementById('pcn_'+i).value.trim();
  const text=document.getElementById('pct_'+i).value.trim();
  if(!name||!text){toast('请填写名字和留言');return;}
  if(text.length>100){toast('留言不能超过100字');return;}
  try{
    const d=await getF(PHP);const ph=d?d.content:[];
    if(!ph[i])return;
    const ts=new Date().toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
    if(!ph[i].comments)ph[i].comments=[];
    ph[i].comments.push({name,text,time:ts,id:Date.now()+Math.random()});
    await putF(PHP,ph,d?d.sha:null);
    document.getElementById('pcn_'+i).value='';document.getElementById('pct_'+i).value='';
    document.getElementById('pcf_'+i).classList.remove('open');
    disPhotos();
    toast('💬 留言已发布！');
  }catch(e){toast('❌ 留言失败');}
}

async function delPhotoComment(pi,ci){
  if(!confirm('删除这条留言？'))return;
  try{
    const d=await getF(PHP);const ph=d?d.content:[];
    if(!ph[pi]||!ph[pi].comments)return;
    ph[pi].comments.splice(ci,1);
    await putF(PHP,ph,d?d.sha:null);
    disPhotos();toast('🗑️ 已删除');
  }catch(e){toast('❌ 删除失败');}
}
async function saveAbout(){
  const t=document.getElementById('abText').value.trim();if(!t){toast('Write something');return;}
  const photoFile=document.getElementById('abPhoto').files[0];
  try{
    let photoUrl=null;
    if(photoFile){
      const b64=await readF(photoFile);
      const fn='about_'+Date.now()+'.jpg';
      photoUrl=await upFile(fn,b64);
    }
    const ex=await getF(AP);
    const cur=ex&&ex.content?ex.content:{};
    const data={text:t,photo:photoUrl||cur.photo||null,resume:cur.resume||[]};
    await putF(AP,data,ex?ex.sha:null);
    setSt(true,'✅ About saved!');disAbout();
    if(photoFile){document.getElementById('abPhoto').value='';}
    toast('💾 Saved!');
  }catch(e){setSt(false,'❌ Failed: '+e.message);}
}

async function saveResume(){
  const text=document.getElementById('abResume').value.trim();
  if(!text){toast('至少输入一条履历');return;}
  const lines=text.split('\n').filter(l=>l.trim());
  const resume=[];
  for(const line of lines){
    const parts=line.split('|').map(s=>s.trim());
    if(parts.length>=4){
      resume.push({
        period:parts[0],title:parts[1],
        company:parts[2],city:parts[3],
        type:parts[4]||'work'
      });
    }
  }
  if(!resume.length){toast('格式有误，请检查');return;}
  try{
    const ex=await getF(AP);
    const cur=ex&&ex.content?ex.content:{};
    const data={text:cur.text||'Akito Lau',photo:cur.photo||null,resume};
    await putF(AP,data,ex?ex.sha:null);
    setSt(true,'✅ Resume saved!');disAbout();toast('📋 Resume saved!');
  }catch(e){setSt(false,'❌ Failed: '+e.message);}
}

// City → coordinates for map
const cityCoords={
  '北京':[39.9042,116.4074],
  '苏州':[31.2990,120.5853],
  '上海':[31.2304,121.4737],
  '深圳':[22.5431,114.0579],
  '广东中山':[22.5197,113.3930],
  '中山':[22.5197,113.3930],
  '吉林':[43.8379,126.5496]
};

let _aboutMap=null;
async function disAbout(){
  try{
    const d=await getF(AP);
    const data=d&&d.content?d.content:null;
    // Poetic text
    const tp=document.getElementById('aboutPoeticText');
    if(data&&data.text)tp.textContent=data.text;
    else tp.textContent=lang==='zh'?'Akito Lau — 数据分析师、独立音乐人、户外爱好者。毕业于中国人民大学。':'Akito Lau — Data analyst, independent musician, outdoor enthusiast. Graduated from Renmin University of China.';

    // Photo
    const ph=document.getElementById('aboutPhotoImg');
    const pl=document.getElementById('aboutPhotoPlaceholder');
    if(data&&data.photo){
      ph.src=data.photo;ph.style.display='block';
      pl.style.display='none';
    }else{
      ph.style.display='none';
      pl.style.display='flex';
    }

    // Resume timeline
    const rt=document.getElementById('resumeTimeline');
    const resume=data&&data.resume&&data.resume.length?data.resume:getDefaultResume();
    rt.innerHTML=resume.map(r=>{
      const icons={work:'💼',edu:'🎓',paper:'📄'};
      return `<div class="rt-item ${r.type||'work'}">
        <div class="rt-period">${esc(r.period)}</div>
        <div class="rt-title">${icons[r.type]||'💼'} ${esc(r.title)}</div>
        <div class="rt-company">${esc(r.company)}<span class="rt-dot">·</span>${esc(r.city)}</div>
      </div>`;
    }).join('');

    // Map
    renderResumeMap(resume);

    // Load admin text if admin available
    const admT=document.getElementById('abText');
    if(admT&&data&&data.text)admT.value=data.text;
    const admR=document.getElementById('abResume');
    if(admR&&resume.length){
      admR.value=resume.map(r=>`${r.period} | ${r.title} | ${r.company} | ${r.city} | ${r.type||'work'}`).join('\n');
    }
  }catch(e){console.log('About load error:',e);}
}

function getDefaultResume(){
  return [
    {period:'2026',title:'数据分析师',company:'完美中国',city:'广东中山',type:'work'},
    {period:'2025',title:'零售与渠道',company:'华为',city:'吉林',type:'work'},
    {period:'2023-2025',title:'金融硕士',company:'中国人民大学（苏州）',city:'苏州',type:'edu'},
    {period:'2019-2023',title:'管理学学士',company:'中国人民大学',city:'北京',type:'edu'},
  ];
}

function renderResumeMap(resume){
  const container=document.getElementById('resumeMap');
  if(!container)return;
  // Gather unique cities
  const cities=[];
  const seen=new Set();
  for(const r of resume){
    if(!seen.has(r.city)){
      seen.add(r.city);
      const coords=cityCoords[r.city];
      if(coords)cities.push({name:r.city,lat:coords[0],lng:coords[1],items:[r]});
      else{cities.push({name:r.city,custom:true,items:[r]});}
    }else{
      const c=cities.find(c=>c.name===r.city);
      if(c)c.items.push(r);
    }
  }
  // Destroy old map
  if(_aboutMap){_aboutMap.remove();_aboutMap=null;}
  container.innerHTML='';
  // If no known coords, hide map
  const known=cities.filter(c=>!c.custom);
  if(!known.length){document.getElementById('resumeMapWrap').style.display='none';return;}
  document.getElementById('resumeMapWrap').style.display='block';
  _aboutMap=L.map(container).setView([31.5,114],5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'© OpenStreetMap',
    maxZoom:12,minZoom:4
  }).addTo(_aboutMap);
  // Pins
  const colors={work:'#007AFF',edu:'#34C759',paper:'#C084FC'};
  known.forEach(c=>{
    const icon=L.divIcon({
      html:`<div style="background:${colors[c.items[0].type]||'#007AFF'};color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,0.2);border:2px solid white;">${c.items.length}</div>`,
      className:'',iconSize:[28,28],iconAnchor:[14,14]
    });
    const popup=c.items.map(r=>`<strong>${esc(r.title)}</strong><br><span style="color:#666;font-size:.78rem;">${esc(r.company)} · ${r.period}</span>`).join('<hr style="margin:3px 0;">');
    L.marker([c.lat,c.lng],{icon}).addTo(_aboutMap).bindPopup(`<div style="font-size:.8rem;">${popup}</div>`);
  });
}

// ===== INIT =====
const savedLang=localStorage.getItem('akito_lang');if(savedLang)setLang(savedLang);
document.getElementById('logoLink').addEventListener('dblclick',e=>{e.preventDefault();openAdmin();});
document.getElementById('phDesc')?.addEventListener('input',function(){document.getElementById('phDescCount').textContent=this.value.length+'/100';});
disAlbums('homeAlbums');disAlbums('musicAlbums');disPosts();disFM();disGB();disDesigns();disPhotos();disAbout();
// Visitor counter
(async function(){const el=document.getElementById('siteCounter');if(!el)return;
try{const[t,r]=await Promise.all([fetch('https://api.countapi.xyz/hit/akitolau.github.io/visits').catch(()=>null),fetch('https://api.countapi.xyz/get/akitolau.github.io/visits').catch(()=>null)]);if(t&&t.ok){const td=await t.json();const gd=r&&r.ok?await r.json():null;const total=td.value||0;const today=gd?gd.value:0;el.innerHTML=`👁️ 总访问 <span class="num">${total}</span> · 今日 <span class="num">${today}</span>`;}else throw 0;}catch(e){const lv=parseInt(localStorage.getItem('akito_visits')||'0')+1;localStorage.setItem('akito_visits',lv+'');const lt=localStorage.getItem('akito_visit_date');const td=new Date().toISOString().slice(0,10);const ld=lt===td?parseInt(localStorage.getItem('akito_today')||'1'):1;localStorage.setItem('akito_visit_date',td);localStorage.setItem('akito_today',ld+'');el.innerHTML=`👁️ 总访问 <span class="num">${lv}</span> · 今日 <span class="num">${ld}</span>`;}})();
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){const a=document.activeElement;if(a&&(a.id==='gbName'||a.id==='gbText'))postMsg();}if(e.key==='Escape')closeAdmin();});
