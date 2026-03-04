const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const state = {
  lang: "ar",
  paper: {
    title: "",
    venue: "",
    year: "",
    link: "",
    problem: "",
    rq: "",
    method: "",
    metrics: "",
    results: "",
    limits: "",
    takeaway: ""
  }
};

const i18n = {
  ar: {
    brand_title: "بروتوكول قراءة الأوراق العلمية",
    brand_sub: "10 خطوات + قوالب نشر + One‑Pager",
    lang_toggle: "تبديل اللغة",
    open_modal: "إدخال بيانات ورقة",
    hero_title: "اقرأ أي ورقة علمية بسرعة… وبشكل قابل للنشر",
    hero_lead: "حوّل قراءتك إلى “مخرجات” جاهزة: سؤال بحث، ملخص مُنظم، منهجية، نتائج، قيود، ثم بوست/ثريد جاهز لـ X وLinkedIn.",
    cta_steps: "ابدأ بالخطوات الـ10",
    cta_pdf: "طباعة / حفظ PDF",
    pill_for: "مناسب لـ",
    pill_style: "الأسلوب",
    pill_style_v: "Structured + مناسب للأكاديميا",
    snapshot_title: "ملخص الورقة (Snapshot)",
    snapshot_hint: "املأ البيانات من “إدخال بيانات ورقة”",
    m_title: "العنوان",
    m_venue: "الجهة/المؤتمر",
    m_year: "السنة",
    m_link: "الرابط",
    m_rq: "سؤال البحث",
    m_takeaway: "الخلاصة",
    badge_trust: "بدون مبالغة • مع قيود",
    badge_ready: "جاهز للنشر",

    steps_title: "الخطوات الـ10 (Protocol)",
    steps_sub: "كل خطوة = هدف + سؤال واحد + مخرج واضح. (مستوحاة من صفحتك الأصلية)",
    outputs_title: "مخرجات جاهزة للنشر",
    outputs_sub: "انسخ والصق فورًا: ثريد X، بوست LinkedIn، قالب One‑Pager، وقالب Graphical Abstract.",
    copy: "نسخ",
    x_hint: "نصيحة: خلي كل تغريدة ≤ 240 حرف، وحط الرابط في آخر ثريد.",
    li_hint: "ارفع One‑Pager كـ PDF مع البوست لرفع المصداقية.",

    example_title: "مثال (Example)",
    example_sub: "مثال تعبئة سريع عشان تشوف الشكل النهائي.",
    fill_example: "تعبئة المثال",
    example_note_h: "ملحوظة",
    example_note_b: "لو عندك الورقة الكاملة/DOI أو لقطة من النتائج بالأرقام، هتطلع القوالب أقوى بكتير.",

    refs_title: "مراجع تصميم/منهجية",
    footer_title: "استخدمه كسلسلة محتوى",
    footer_sub: "غلاف ثابت + 10 خطوات + مخرجات نشر = هوية محتوى قابلة للتكرار.",

    modal_title: "إدخال بيانات الورقة",
    f_title: "عنوان الورقة",
    f_venue: "المؤتمر/المجلة",
    f_year: "السنة",
    f_link: "رابط الورقة / DOI",
    f_problem: "المشكلة (Problem) — سطرين",
    f_rq: "سؤال البحث (Research Question)",
    f_method: "المنهج/الفكرة (Method) — 3 نقاط",
    f_metrics: "المقاييس (Metrics)",
    f_results: "النتائج (Results) — أرقام/مقارنات",
    f_limits: "القيود (Limitations) — نقطتين",
    f_takeaway: "خلاصة عملية (Takeaway) — جملة",
    cancel: "إلغاء",
    apply: "تطبيق على الصفحة"
  },

  en: {
    brand_title: "Paper Reading Protocol",
    brand_sub: "10 steps + X/LinkedIn templates + One‑Pager",
    lang_toggle: "Toggle language",
    open_modal: "Enter paper data",
    hero_title: "Read any paper faster… and publish your take",
    hero_lead: "Turn reading into outputs: RQ, structured summary, method, results, limitations—then a ready X thread & LinkedIn post.",
    cta_steps: "Start the 10 steps",
    cta_pdf: "Print / Save as PDF",
    pill_for: "For",
    pill_style: "Style",
    pill_style_v: "Structured + academic‑friendly",
    snapshot_title: "Paper Snapshot",
    snapshot_hint: "Fill from “Enter paper data”",
    m_title: "Title",
    m_venue: "Venue",
    m_year: "Year",
    m_link: "Link",
    m_rq: "Research Question",
    m_takeaway: "Takeaway",
    badge_trust: "No hype • with limits",
    badge_ready: "Ready to share",

    steps_title: "The 10‑Step Protocol",
    steps_sub: "Each step = goal + one question + a clear output. (Inspired by your original page)",
    outputs_title: "Share‑ready outputs",
    outputs_sub: "Copy‑paste: X thread, LinkedIn post, One‑Pager template, Graphical Abstract template.",
    copy: "Copy",
    x_hint: "Tip: keep each tweet ≤ 240 chars; put the link at the end.",
    li_hint: "Attach the One‑Pager PDF for credibility.",

    example_title: "Example",
    example_sub: "Quick fill so you can see the end result.",
    fill_example: "Fill example",
    example_note_h: "Note",
    example_note_b: "If you have the full paper/DOI or a screenshot of numeric results, the templates become much stronger.",

    refs_title: "References",
    footer_title: "Use it as a content series",
    footer_sub: "Fixed cover + 10 steps + outputs = repeatable content identity.",

    modal_title: "Paper Data Entry",
    f_title: "Paper title",
    f_venue: "Venue / Journal",
    f_year: "Year",
    f_link: "Paper link / DOI",
    f_problem: "Problem — 2 lines",
    f_rq: "Research Question",
    f_method: "Method — 3 bullets",
    f_metrics: "Metrics",
    f_results: "Results — numbers/comparisons",
    f_limits: "Limitations — 2 bullets",
    f_takeaway: "Takeaway — 1 sentence",
    cancel: "Cancel",
    apply: "Apply"
  }
};

const steps = [
  { goal_ar:"تكوين فهم أساسي", goal_en:"Build baseline understanding", title_ar:"اقرأ المقدمة قبل الملخص", title_en:"Read the introduction before the abstract", q_ar:"إيه السياق اللي الورقة جاية تحلّه؟", q_en:"What context is this paper addressing?", out_ar:"سياق في 3–5 جمل", out_en:"3–5 sentence context" },
  { goal_ar:"تحديد جوهر الورقة", goal_en:"Identify the core", title_ar:"حدّد المشكلة الرئيسية", title_en:"Identify the main problem", q_ar:"الورقة بتحاول تمنع/تحسّن إيه؟", q_en:"What does it aim to fix or improve?", out_ar:"Problem statement", out_en:"Problem statement" },
  { goal_ar:"تلخيص الأعمال السابقة", goal_en:"Summarize prior work", title_ar:"لخّص السياق في 5 جمل", title_en:"Summarize related work in 5 sentences", q_ar:"إيه اللي كان موجود وإيه اللي ناقص؟", q_en:"What exists and what is missing?", out_ar:"Gap واضح", out_en:"Clear gap" },
  { goal_ar:"صياغة أسئلة دقيقة", goal_en:"Form precise questions", title_ar:"استخرج الأسئلة/الفرضيات", title_en:"Extract research questions/hypotheses", q_ar:"إيه السؤال اللي لازم التجارب تجاوب عليه؟", q_en:"What must experiments answer?", out_ar:"RQ/فرضية", out_en:"RQ/Hypothesis" },
  { goal_ar:"فهم المنهج", goal_en:"Understand method", title_ar:"حدّد تركيز الورقة", title_en:"Identify the paper’s focus", q_ar:"الابتكار فين؟ خوارزمية؟ بيانات؟ تقييم؟", q_en:"Where is the novelty: method, data, or evaluation?", out_ar:"3 نقاط Method", out_en:"3 bullets method" },
  { goal_ar:"قراءة النتائج بعين محايدة", goal_en:"Read results neutrally", title_ar:"اقرأ النتائج وسجّل الملاحظات", title_en:"Read results and log observations", q_ar:"إيه اللي حصل في كل تجربة/شكل بدون تفسير؟", q_en:"What happened per experiment/figure without interpreting?", out_ar:"List observations", out_en:"Observations list" },
  { goal_ar:"اختبار الإجابة", goal_en:"Check if answered", title_ar:"هل النتائج بتجاوب الأسئلة؟", title_en:"Do results answer the questions?", q_ar:"فين الإجابة المباشرة على RQ؟", q_en:"Where is the direct answer to the RQ?", out_ar:"Yes/No + Why", out_en:"Yes/No + Why" },
  { goal_ar:"فهم النقاش", goal_en:"Understand discussion", title_ar:"اقرأ المناقشة والخاتمة", title_en:"Read discussion & conclusion", q_ar:"هل تفسير المؤلفين منطقي؟", q_en:"Are authors’ interpretations justified?", out_ar:"Your critique", out_en:"Your critique" },
  { goal_ar:"مراجعة الملخص", goal_en:"Re-check abstract", title_ar:"ارجع للملخص وراجعه", title_en:"Revisit the abstract", q_ar:"هل الملخص متوافق مع اللي فهمته؟", q_en:"Does the abstract match your understanding?", out_ar:"Mismatch notes", out_en:"Mismatch notes" },
  { goal_ar:"وضع الورقة في السياق", goal_en:"Place in context", title_ar:"اربطها بالمجال الأكبر", title_en:"Place it in a broader context", q_ar:"إيه الأوراق التالية اللي لازم تقراها؟", q_en:"What should you read next?", out_ar:"Next papers list", out_en:"Next papers list" }
];

function setLang(lang){
  state.lang = lang;
  const t = i18n[lang];

  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });

  if(lang === "en"){
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  } else {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }

  renderSteps();
  renderOutputs();
}

function renderSteps(){
  const lang = state.lang;
  const grid = $("#stepsGrid");
  grid.innerHTML = "";

  steps.forEach((s, idx) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card__top">
        <div>
          <div class="stepno">${String(idx+1).padStart(2,"0")}</div>
        </div>
        <div style="flex:1;">
          <h3 class="card__title">${lang==="en" ? s.title_en : s.title_ar}</h3>
          <div class="card__goal">${lang==="en" ? "Goal:" : "الهدف:"} ${lang==="en" ? s.goal_en : s.goal_ar}</div>
        </div>
      </div>
      <div class="card__q">${lang==="en" ? s.q_en : s.q_ar}</div>
      <div class="card__out">${lang==="en" ? "Output:" : "المخرج:"} <span>${lang==="en" ? s.out_en : s.out_ar}</span></div>
    `;
    grid.appendChild(card);
  });
}

function renderOutputs(){
  const p = state.paper;
  const lang = state.lang;

  const safeTitle = p.title || (lang==="en" ? "Paper title" : "عنوان الورقة");
  const safeLink = p.link || "LINK";
  const safeRQ = p.rq || (lang==="en" ? "Research Question..." : "سؤال البحث...");
  const safeProblem = p.problem || (lang==="en" ? "Problem..." : "المشكلة...");
  const safeMethod = p.method || (lang==="en" ? "• Method bullet 1\n• Method bullet 2\n• Method bullet 3" : "• نقطة 1\n• نقطة 2\n• نقطة 3");
  const safeResults = p.results || (lang==="en" ? "Key numbers + comparisons..." : "أهم الأرقام + المقارنات...");
  const safeLimits = p.limits || (lang==="en" ? "• Limitation 1\n• Limitation 2" : "• قيد 1\n• قيد 2");
  const safeTakeaway = p.takeaway || (lang==="en" ? "One-sentence takeaway..." : "خلاصة بجملة واحدة...");

  const x = (lang==="en")
`1) New paper: ${safeTitle}
Why it matters: ${safeProblem}

2) Research Question:
${safeRQ}

3) Core idea / method:
${safeMethod}

4) Evaluation:
Metrics: ${p.metrics || "—"}
Results: ${safeResults}

5) Limitations:
${safeLimits}

6) Takeaway:
${safeTakeaway}

Link: ${safeLink}`
:
`1) ورقة جديدة: ${safeTitle}
ليه مهمة؟ ${safeProblem}

2) سؤال البحث:
${safeRQ}

3) الفكرة/المنهج:
${safeMethod}

4) التقييم:
المقاييس: ${p.metrics || "—"}
النتائج: ${safeResults}

5) القيود:
${safeLimits}

6) الخلاصة:
${safeTakeaway}

الرابط: ${safeLink}`;

  const li = (lang==="en")
`${safeTitle}

Problem:
${safeProblem}

Research Question:
${safeRQ}

Method (in 3 bullets):
${safeMethod}

Key results:
${safeResults}

Limitations:
${safeLimits}

Takeaway:
${safeTakeaway}

🔗 ${safeLink}

#research #academia #paperreview`
:
`${safeTitle}

المشكلة:
${safeProblem}

سؤال البحث:
${safeRQ}

المنهج (٣ نقاط):
${safeMethod}

أهم النتائج:
${safeResults}

القيود:
${safeLimits}

الخلاصة:
${safeTakeaway}

🔗 ${safeLink}

#بحث_علمي #أكاديميا #قراءة_ورقة`;

  const one = (lang==="en")
`TITLE: ${safeTitle}
VENUE/YEAR: ${p.venue || "—"} • ${p.year || "—"}
LINK/DOI: ${safeLink}

BACKGROUND (2 lines):
${safeProblem}

RESEARCH QUESTION:
${safeRQ}

METHOD (3 bullets):
${safeMethod}

SETUP / DATA:
${p.metrics ? "Metrics: " + p.metrics : "Metrics: —"}

RESULTS (numbers + baseline):
${safeResults}

LIMITATIONS (2 bullets):
${safeLimits}

TAKEAWAY (1 sentence):
${safeTakeaway}`
:
`العنوان: ${safeTitle}
الجهة/السنة: ${p.venue || "—"} • ${p.year || "—"}
الرابط/DOI: ${safeLink}

الخلفية (سطرين):
${safeProblem}

سؤال البحث:
${safeRQ}

المنهج (٣ نقاط):
${safeMethod}

البيانات/الإعداد:
${p.metrics ? "المقاييس: " + p.metrics : "المقاييس: —"}

النتائج (أرقام + مقارنة):
${safeResults}

القيود (نقطتين):
${safeLimits}

الخلاصة (جملة):
${safeTakeaway}`;

  const ga = (lang==="en")
`GRAPHICAL ABSTRACT (3 blocks)

[INPUT]
Data/scene: (what video/images/text)
Constraint: privacy/speed/etc.

[METHOD]
Core pipeline in 3 steps:
1) ...
2) ...
3) ...

[OUTPUT]
What improves (numbers) + what stays acceptable (utility)
Limitations: when it fails`
:
`ملخص بصري (3 بلوكات)

[المدخلات]
نوع البيانات/المشهد
القيود: خصوصية/سرعة/دقة…

[الطريقة]
خطوات خط الأنابيب (3 خطوات):
1) ...
2) ...
3) ...

[المخرجات]
إيه اللي تحسّن (بالأرقام) + إيه اللي اتفظ (Utility)
قيود: متى تفشل`;

  $("#xText").value = x;
  $("#liText").value = li;
  $("#onePager").value = one;
  $("#gaText").value = ga;
}

function applyPaperFromForm(){
  state.paper.title = $("#fTitle").value.trim();
  state.paper.venue = $("#fVenue").value.trim();
  state.paper.year = $("#fYear").value.trim();
  state.paper.link = $("#fLink").value.trim();
  state.paper.problem = $("#fProblem").value.trim();
  state.paper.rq = $("#fRQ").value.trim();
  state.paper.method = $("#fMethod").value.trim();
  state.paper.metrics = $("#fMetrics").value.trim();
  state.paper.results = $("#fResults").value.trim();
  state.paper.limits = $("#fLimits").value.trim();
  state.paper.takeaway = $("#fTakeaway").value.trim();

  // Update snapshot
  $("#vTitle").textContent = state.paper.title || "—";
  $("#vVenue").textContent = state.paper.venue || "—";
  $("#vYear").textContent = state.paper.year || "—";

  const link = $("#vLink");
  if(state.paper.link){
    link.textContent = state.paper.link;
    link.href = state.paper.link;
  } else {
    link.textContent = "—";
    link.href = "#";
  }

  $("#vRQ").textContent = state.paper.rq || "—";
  $("#vTakeaway").textContent = state.paper.takeaway || "—";

  renderOutputs();
  toast(state.lang === "en" ? "Applied to page." : "تم تطبيق البيانات على الصفحة.");
}

function openModal(){
  $("#modal").classList.add("is-open");
  $("#modal").setAttribute("aria-hidden","false");
}
function closeModal(){
  $("#modal").classList.remove("is-open");
  $("#modal").setAttribute("aria-hidden","true");
}

function toast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove("is-show"), 1600);
}

function copyFromSelector(sel){
  const el = $(sel);
  el.select();
  document.execCommand("copy");
  toast(state.lang === "en" ? "Copied." : "تم النسخ.");
}

function setupTabs(){

  $$(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");

      $$(".tab").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");


      $$(".pane").forEach(p => p.classList.remove("is-active"));
      if(tab==="x") $("#pane-x").classList.add("is-active");
      if(tab==="li") $("#pane-li").classList.add("is-active");
      if(tab==="one") $("#pane-one").classList.add("is-active");
      if(tab==="ga") $("#pane-ga").classList.add("is-active");
    });
  });
}

function fillExample(){
  // Example uses the PDF link provided in context
  $("#fTitle").value = "Low‑Latency Video Anonymization for Crowd Anomaly Detection";
  $("#fVenue").value = "IEEE (summary PDF)";
  $("#fYear").value = "2025";
  $("#fLink").value = "https://gensparkstorageprodwest.blob.core.windows.net/personal/e1203786-bc54-4f45-9c13-f12c5ba61e62/upload/default/fc907da0-8282-4cc8-85aa-72f62ffbe9b2?se=2026-03-04T05%3A33%3A39Z&sp=r&sv=2025-05-05&sr=b&rsct=application/pdf&sig=S/Elq1idLmny3w3J66eGdJt3eFpRA8%2BEmezy2ml2NW8%3D";
  $("#fProblem").value = "Existing anonymization is privacy‑preserving but computationally heavy; hard to run in real‑time on edge devices.";
  $("#fRQ").value = "How can we protect individuals’ privacy in surveillance video while preserving crowd anomaly detection efficacy and low latency?";
  $("#fMethod").value = "• LA3D: lightweight adaptive anonymization\n• Dynamically balances privacy vs compute\n• Designed for real‑time edge deployment";
  $("#fMetrics").value = "Privacy level, VAD efficacy, latency/FPS";
  $("#fResults").value = "Very low latency suitable for real‑time; privacy improved with minimal utility degradation (numbers not present in the 3‑page summary).";
  $("#fLimits").value = "• Summary PDF lacks detailed dataset names and numeric tables\n• Generalization depends on device/setup and VAD model";
  $("#fTakeaway").value = "Adaptive, lightweight anonymization is a practical path for privacy‑preserving real‑time surveillance on the edge.";

  openModal();
}

function setup(){
  // buttons
  $("#btnLang").addEventListener("click", () => setLang(state.lang === "ar" ? "en" : "ar"));
  $("#btnOpen").addEventListener("click", openModal);
  $("#fab").addEventListener("click", openModal);
  $("#btnApply").addEventListener("click", () => { applyPaperFromForm(); closeModal(); });
  $("#btnPrint").addEventListener("click", () => window.print());
  $("#btnFillExample").addEventListener("click", fillExample);

  // modal close
  $("#modal").addEventListener("click", (e) => {
    if(e.target && e.target.dataset && e.target.dataset.close) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") closeModal();
  });

  // copy buttons

  $$("[data-copy]").forEach(btn => {
    btn.addEventListener("click", () => copyFromSelector(btn.getAttribute("data-copy")));
  });

  setupTabs();

  // initial
  setLang("ar");
  applyPaperFromForm();
}

setup();
