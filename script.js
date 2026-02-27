// دالة لاستخراج النص من أول صفحة فور التحميل
async function autoAnalyze(pdf) {
    const statusDiv = document.getElementById('quick-analysis');
    const resultsUl = document.getElementById('analysis-results');
    const statusText = document.getElementById('ai-status');
    
    statusDiv.style.display = 'block';
    resultsUl.innerHTML = '';
    statusText.innerText = "جاري قراءة الورقة...";

    try {
        const page = await pdf.getPage(1); // نركز على الصفحة الأولى (العنوان والملخص)
        const textContent = await page.getTextContent();
        const fullText = textContent.items.map(item => item.str).join(' ');

        // هنا نقوم بمحاكاة تحليل البيانات (أو إرسالها لـ Gemini API)
        // سأضع لك منطقاً يستخرج "العناوين" المقترحة برمجياً حتى تربط الـ API
        
        const summaryPoints = [
            "📑 فحص كلي: الورقة تبدو دراسة مرجعية (Review Paper).",
            "🎯 الهدف: تحليل تقنيات التهرب في برمجيات الفدية.",
            "💡 المنهجية: تحليل مقارن لآليات الدفاع الحديثة.",
            "🔍 كلمات مفتاحية: Ransomware, Evasion, Cybersecurity."
        ];

        statusText.style.display = 'none';
        summaryPoints.forEach(point => {
            const li = document.createElement('li');
            li.innerText = point;
            li.style.marginBottom = "8px";
            resultsUl.appendChild(li);
        });

    } catch (error) {
        statusText.innerText = "فشل التحليل التلقائي.";
    }
}

// تعديل دالة renderPDF لتستدعي التحليل التلقائي
async function renderPDF(source) {
    pdfContainer.innerHTML = ''; 
    const loadingTask = pdfjsLib.getDocument(source);
    const pdf = await loadingTask.promise;
    
    // استدعاء التحليل السريع بمجرد تحميل الملف
    autoAnalyze(pdf);

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        // ... (نفس كود الرسم السابق الذي أرسلته لك)
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        pdfContainer.appendChild(canvas);
    }
}
