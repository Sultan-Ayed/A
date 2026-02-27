const API="https://api.anthropic.com/v1/messages";
const dz=document.getElementById('dropZone'),fi=document.getElementById('fileInput');
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('dragover')});
dz.addEventListener('dragleave',()=>dz.classList.remove('dragover'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('dragover');if(e.dataTransfer.files[0])go(e.dataTransfer.files[0])});
fi.addEventListener('change',e=>{if(e.target.files[0])go(e.target.files[0])});

function setStep(t){document.getElementById('loadingStep').textContent=t}
function showLoad(){dz.style.display='none';document.getElementById('loadingState').style.display='block';document.getElementById('results').style.display='none';document.getElementById('errorBox').style.display='none'}
function showErr(m){document.getElementById('loadingState').style.display='none';dz.style.display='block';const e=document.getElementById('errorBox');e.style.display='block';e.textContent='❌ '+m}
function showRes(){document.getElementById('loadingState').style.display='none';dz.style.display='none';document.getElementById('results').style.display='block';setTimeout(animBars,400)}

async function go(file){
  const ext=file.name.split('.').pop().toLowerCase();
  if(!['pdf','txt','doc','docx'].includes(ext)){showErr('نوع الملف غير مدعوم · Unsupported file type');return}
  showLoad();
  try{
    let msgs;
    if(ext==='pdf'){
      setStep('تحويل PDF · Converting...');
      const b=await toB64(file);
      msgs=[{role:'user',content:[{type:'document',source:{type:'base64',media_type:'application/pdf',data:b}},{type:'text',text:buildPrompt()}]}];
    }else{
      setStep('قراءة النص · Reading...');
      const t=await file.text();
      msgs=[{role:'user',content:buildPrompt(t)}];
    }
    setStep('تحليل ثنائي اللغة · Bilingual analysis...');
    const res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:5500,messages:msgs})});
    if(!res.ok){const e=await res.json();throw new Error(e.error?.message||'API Error')}
    setStep('معالجة النتائج · Processing...');
    const data=await res.json();
    const raw=data.content.map(b=>b.text||'').join('');
    const json=parseJ(raw);
    if(!json)throw new Error('فشل تحليل الورقة · Could not parse paper. Ensure the file contains readable text.');
    render(json);showRes();
  }catch(e){showErr(e.message)}
}

function toB64(f){return new Promise((r,j)=>{const rd=new FileReader();rd.onload=()=>r(rd.result.split(',')[1]);rd.onerror=()=>j(new Error('Read failed'));rd.readAsDataURL(f)})}

function buildPrompt(text){
  return`You are a bilingual (Arabic/English) expert scientific paper analyst. Analyze the ${text?'following':'attached'} research paper. Return ONLY valid JSON with no markdown, no text outside JSON.

${text?'PAPER CONTENT:\n'+text.slice(0,14000):''}

IMPORTANT: ALL fields ending in _ar MUST be in Arabic. ALL fields ending in _en MUST be in English.

{
  "paper_type_ar":"نوع الورقة بالعربي",
  "paper_type_en":"Paper type in English",
  "title":"Full original title",
  "title_ar":"العنوان بالعربي",
  "title_en":"Title in English",
  "year":"YYYY",
  "journal":"Journal/Conference name",
  "doi":"DOI or null",
  "language":"Original language",
  "pages":"page info",
  "authors":[{"name":"Full name","name_ar":"الاسم بالعربي","university":"Institution","university_ar":"المؤسسة بالعربي","department":"Dept","department_ar":"القسم بالعربي","email":"email or null","is_corresponding":true}],
  "abstract_ar":"ملخص شامل بالعربية 6-8 جمل",
  "abstract_en":"Comprehensive abstract in English 6-8 sentences",
  "keywords_ar":["كلمة1","كلمة2","كلمة3","كلمة4","كلمة5"],
  "keywords_en":["keyword1","keyword2","keyword3","keyword4","keyword5"],
  "objective_ar":["الهدف الرئيسي","الفجوة البحثية","سؤال البحث"],
  "objective_en":["Main objective","Research gap","Research question"],
  "methodology":[{"step_ar":"الخطوة بالعربي","desc_ar":"وصف بالعربي","step_en":"Step in English","desc_en":"Description in English"}],
  "findings_ar":["نتيجة1","نتيجة2","نتيجة3","نتيجة4"],
  "findings_en":["Finding1","Finding2","Finding3","Finding4"],
  "contributions_ar":["إسهام1","إسهام2","إسهام3"],
  "contributions_en":["Contribution1","Contribution2","Contribution3"],
  "strengths_ar":["قوة1","قوة2","قوة3"],
  "strengths_en":["Strength1","Strength2","Strength3"],
  "weaknesses_ar":["قيد1","قيد2","قيد3"],
  "weaknesses_en":["Limitation1","Limitation2","Limitation3"],
  "future_work_ar":["اتجاه1","اتجاه2","اتجاه3"],
  "future_work_en":["Direction1","Direction2","Direction3"],
  "critical_questions_ar":["سؤال نقدي1","سؤال2","سؤال3","سؤال4","سؤال5"],
  "critical_questions_en":["Critical question1","Question2","Question3","Question4","Question5"],
  "checklist_ar":["✅ بند1","✅ بند2","✅ بند3","✅ بند4","✅ بند5"],
  "checklist_en":["✅ Item1","✅ Item2","✅ Item3","✅ Item4","✅ Item5"],
  "scores":{"methodology_rigor":0,"clarity_organization":0,"novelty_originality":0,"evidence_quality":0,"reproducibility":0,"literature_coverage":0},
  "conclusion_ar":"خلاصة شاملة بالعربي 4-5 جمل",
  "conclusion_en":"Overall conclusion in English 4-5 sentences",
  "citation_apa":"Full APA citation"
}`;
}

function parseJ(raw){
  try{return JSON.parse(raw.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim())}
  catch{const m=raw.match(/\{[\s\S]*\}/);if(m)try{return JSON.parse(m[0])}catch{}return null}
}

function render(d){
  document.getElementById('paperType').textContent=(d.paper_type_ar||'')+(d.paper_type_en?' · '+d.paper_type_en:'');
  const t=d.title||d.title_en||'—',ta=d.title_ar||'';
  document.getElementById('paperTitle').innerHTML=t+(ta&&ta!==t?`<div style="font-size:17px;color:var(--text2);margin-top:6px;direction:rtl;font-family:'Tajawal',sans-serif;font-weight:400">${ta}</div>`:'');

  const ms=[
    {icon:'📅',label:'Year',value:d.year||'—'},
    {icon:'📰',label:'Journal / المجلة',value:d.journal||'—'},
    {icon:'🔗',label:'DOI',value:d.doi||'—'},
    {icon:'🌐',label:'Language / اللغة',value:d.language||'—'},
    {icon:'📄',label:'Pages / الصفحات',value:d.pages||'—'},
    {icon:'👥',label:'Authors / المؤلفون',value:(d.authors?.length||0)+' authors'},
  ];
  document.getElementById('metaStrip').innerHTML=ms.map(m=>`<div class="meta-pill"><span class="meta-icon">${m.icon}</span><div><div class="meta-label">${m.label}</div><div class="meta-val">${m.value}</div></div></div>`).join('');

  const cols=['#3b82f6','#8b5cf6','#f59e0b','#10b981','#ef4444','#f97316','#ec4899','#14b8a6'];
  document.getElementById('authorsGrid').innerHTML=(d.authors||[]).map((a,i)=>`
    <div class="author-card">
      <div class="author-av" style="background:linear-gradient(135deg,${cols[i%cols.length]},${cols[(i+2)%cols.length]})">${ini(a.name)}</div>
      ${a.name_ar?`<div class="author-name-ar">${a.name_ar}</div>`:''}
      <div class="author-name-en">${a.name||'—'}</div>
      <div class="author-detail">🏛️ ${a.university_ar||a.university||'—'}</div>
      ${a.university&&a.university_ar?`<div class="author-detail" style="direction:ltr;font-family:'Crimson Pro',serif;font-size:11px">🏛 ${a.university}</div>`:''}
      <div class="author-detail">📚 ${a.department_ar||a.department||'—'}</div>
      ${a.email?`<div class="author-email">📧 ${a.email}</div>`:''}
      ${a.is_corresponding?`<span class="corr-badge">✉️ Corresponding · المراسل</span>`:''}
    </div>`).join('');

  document.getElementById('absAr').textContent=d.abstract_ar||'—';
  document.getElementById('absEn').textContent=d.abstract_en||'—';
  document.getElementById('kwAr').innerHTML=(d.keywords_ar||[]).map(k=>`<span class="kw ar-kw">${k}</span>`).join('');
  document.getElementById('kwEn').innerHTML=(d.keywords_en||[]).map(k=>`<span class="kw en-kw">${k}</span>`).join('');
  document.getElementById('objAr').innerHTML=bList(d.objective_ar,'d-orange');
  document.getElementById('objEn').innerHTML=bList(d.objective_en,'d-teal');

  document.getElementById('methodSteps').innerHTML=(d.methodology||[]).map((m,i)=>`
    <div class="method-step">
      <div class="step-num">${i+1}</div>
      <div class="step-body">
        <div class="step-t-ar">${m.step_ar||''}</div>
        <div class="step-d-ar">${m.desc_ar||''}</div>
        <div class="step-t-en">${m.step_en||''}</div>
        <div class="step-d-en">${m.desc_en||''}</div>
      </div>
    </div>`).join('');

  document.getElementById('findAr').innerHTML=bList(d.findings_ar,'d-green');
  document.getElementById('findEn').innerHTML=bList(d.findings_en,'d-teal');
  document.getElementById('contAr').innerHTML=bList(d.contributions_ar,'d-gold');
  document.getElementById('contEn').innerHTML=bList(d.contributions_en,'d-teal');

  document.getElementById('strAr').innerHTML=(d.strengths_ar||[]).map(s=>`<div class="sw-item str"><span>✅</span><span style="direction:rtl">${s}</span></div>`).join('');
  document.getElementById('strEn').innerHTML=(d.strengths_en||[]).map(s=>`<div class="sw-item str"><span>✅</span><span style="direction:ltr;font-family:'Crimson Pro',serif">${s}</span></div>`).join('');
  document.getElementById('limAr').innerHTML=(d.weaknesses_ar||[]).map(w=>`<div class="sw-item lim"><span>⚠️</span><span style="direction:rtl">${w}</span></div>`).join('');
  document.getElementById('limEn').innerHTML=(d.weaknesses_en||[]).map(w=>`<div class="sw-item lim"><span>⚠️</span><span style="direction:ltr;font-family:'Crimson Pro',serif">${w}</span></div>`).join('');
  document.getElementById('futAr').innerHTML=bList(d.future_work_ar,'d-blue');
  document.getElementById('futEn').innerHTML=bList(d.future_work_en,'d-teal');

  const qa=d.critical_questions_ar||[],qe=d.critical_questions_en||[];
  document.getElementById('critQs').innerHTML=Array.from({length:Math.max(qa.length,qe.length)},(_,i)=>`
    <div class="cq-item">
      <div class="cq-num">Q${i+1} · س${i+1}</div>
      ${qa[i]?`<div class="cq-ar">${qa[i]}</div>`:''}
      ${qe[i]?`<div class="cq-en">${qe[i]}</div>`:''}
    </div>`).join('');

  const ca=d.checklist_ar||[],ce=d.checklist_en||[];
  document.getElementById('checklist').innerHTML=Array.from({length:Math.max(ca.length,ce.length)},(_,i)=>`
    <div style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
      ${ca[i]?`<div style="font-size:13px;color:var(--text2);direction:rtl;margin-bottom:2px">${ca[i]}</div>`:''}
      ${ce[i]?`<div style="font-size:12px;color:var(--text3);direction:ltr;font-family:'Crimson Pro',serif">${ce[i]}</div>`:''}
    </div>`).join('');

  const sdefs=[
    {k:'methodology_rigor',ar:'دقة المنهجية',en:'Methodology Rigor',c:'#3b82f6'},
    {k:'clarity_organization',ar:'الوضوح والتنظيم',en:'Clarity & Organization',c:'#8b5cf6'},
    {k:'novelty_originality',ar:'الأصالة والجدة',en:'Novelty & Originality',c:'#f59e0b'},
    {k:'evidence_quality',ar:'جودة الأدلة',en:'Evidence Quality',c:'#10b981'},
    {k:'reproducibility',ar:'قابلية التكرار',en:'Reproducibility',c:'#f97316'},
    {k:'literature_coverage',ar:'تغطية الأدبيات',en:'Literature Coverage',c:'#14b8a6'},
  ];
  const sc=d.scores||{};
  document.getElementById('scoresWrap').innerHTML=sdefs.map(s=>{
    const v=sc[s.k]||0;
    return`<div data-v="${v}" data-c="${s.c}">
      <div class="sc-head"><div><div class="sc-lar">${s.ar}</div><div class="sc-len">${s.en}</div></div><div class="sc-val">${v}<span style="font-size:10px;color:var(--text3)">/100</span></div></div>
      <div class="sc-bg"><div class="sc-bar" style="background:${s.c}"></div></div>
    </div>`;}).join('');

  document.getElementById('concAr').textContent=d.conclusion_ar||'—';
  document.getElementById('concEn').textContent=d.conclusion_en||'—';
  document.getElementById('citText').textContent=d.citation_apa||'—';
  window._cit=d.citation_apa;
}

function bList(arr,dc){return(arr||[]).map(i=>`<li><span class="bd ${dc}"></span><span>${i}</span></li>`).join('')}
function ini(n){if(!n)return'?';const p=n.trim().split(/\s+/);return p.length>=2?(p[0][0]+p[1][0]).toUpperCase():n[0].toUpperCase()}
function animBars(){document.querySelectorAll('[data-v][data-c]').forEach(el=>{const v=parseInt(el.dataset.v);el.querySelector('.sc-bar').style.width=v+'%'})}
function copyCit(){navigator.clipboard.writeText(window._cit||'').then(()=>{const b=document.querySelector('.copy-btn');b.textContent='✅ Copied!';setTimeout(()=>b.textContent='نسخ · Copy',2000)})}
function reset(){document.getElementById('results').style.display='none';dz.style.display='block';document.getElementById('errorBox').style.display='none';fi.value='';window.scrollTo({top:0,behavior:'smooth'})}