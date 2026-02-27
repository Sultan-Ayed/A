const pdfContainer = document.getElementById('pdf-container');
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// 1. معالجة الرفع
document.getElementById('file-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            const typedarray = new Uint8Array(this.result);
            processPDF(typedarray);
        };
        reader.readAsArrayBuffer(file);
    }
});

// 2. التحميل من رابط
async function loadFromURL() {
    const url = document.getElementById('url-input').value;
    if (url) processPDF(url);
}

// 3. معالجة وعرض الـ PDF + التحليل
async function processPDF(source) {
    pdfContainer.innerHTML = ''; 
    document.getElementById('analysis-results').innerHTML = '';
    document.getElementById('ai-status').innerText = "جاري تحليل البيانات...";

    try {
        const loadingTask = pdfjsLib.getDocument(source);
        const pdf = await loadingTask.promise;

        // تشغيل التحليل التلقائي (أول صفحة)
        performQuickAnalysis(pdf);

        // رسم كل الصفحات للقراءة
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            pdfContainer.appendChild(canvas);
        }
    } catch (error) {
        alert("خطأ في تحميل الملف: " + error.message);
    }
}

// 4. وظيفة "الباحث الذكي" - استخراج المعلومات فوراً
async function performQuickAnalysis(pdf) {
    const resultsUl = document.getElementById('analysis-results');
    const statusText = document.getElementById('ai-status');

    try {
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        const text = textContent.items.map(i => i.str).join(' ');

        // محاكاة استخراج البيانات (يمكن ربطها بـ Gemini API هنا)
        const insights = [
            "📌 نوع الورقة: دراسة بحثية تخصصية.",
            `📄 عدد الصفحات: ${pdf.numPages} صفحة.`,
            "🔍 التركيز الأساسي: " + (text.substring(0, 80) + "..."),
            "⏱️ وقت القراءة المتوقع: " + Math.ceil(pdf.numPages * 2.5) + " دقيقة."
        ];

        statusText.style.display = 'none';
        insights.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            li.style.marginBottom = "10px";
            resultsUl.appendChild(li);
        });
    } catch (e) {
        statusText.innerText = "تعذر استخراج البيانات التلقائية.";
    }
}
