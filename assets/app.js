(function () {
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  // Theme
  const themeToggle = $("#themeToggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") document.body.classList.add("light");

  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
    toast(document.body.classList.contains("light") ? "تم تفعيل الوضع الفاتح" : "تم تفعيل الوضع الداكن");
  });

  // Copy buttons

  $$("[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetSel = btn.getAttribute("data-copy-target");
      const el = $(targetSel);
      if (!el) return;

      const text = el.value ?? el.textContent ?? "";
      try {
        await navigator.clipboard.writeText(text);
        toast("تم النسخ");
      } catch {
        // fallback
        el.focus();
        el.select?.();
        document.execCommand("copy");
        toast("تم النسخ");
      }
    });
  });

  // Tabs
  const tabs = $$(".tab");
  const panels = $$(".tabPanel");
  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.remove("is-active"));
      panels.forEach((p) => {
        p.classList.remove("is-active");
        p.hidden = true;
      });

      t.classList.add("is-active");
      const controls = t.getAttribute("aria-controls");
      const panel = $("#" + controls);
      if (panel) {
        panel.hidden = false;
        panel.classList.add("is-active");
        toast("تم فتح القالب");
      }
    });
  });

  // Steps search
  const stepSearch = $("#stepSearch");
  const stepsGrid = $("#stepsGrid");
  const steps = $$(".step", stepsGrid);

  stepSearch?.addEventListener("input", (e) => {
    const q = (e.target.value || "").trim().toLowerCase();
    let visible = 0;

    steps.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const tags = (card.getAttribute("data-tags") || "").toLowerCase();
      const ok = !q || text.includes(q) || tags.includes(q);
      card.style.display = ok ? "" : "none";
      if (ok) visible++;
    });

    if (q) toast(`نتائج مطابقة: ${visible}`);
  });

  // Toast
  const toastEl = $("#toast");
  let toastTimer = null;

  function toast(msg) {
    if (!toastEl) return;
    toastEl.hidden = false;
    toastEl.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 1600);
  }
})();
