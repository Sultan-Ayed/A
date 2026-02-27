const pdfContainer = document.getElementById('pdf-container');
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// ضع مفتاحك هنا (للتجربة فقط، لاحقاً يفضل حمايته)
const GEMINI_API_KEY = "ضغ_مفتاحك_هنا"; 

document.getElementById('file-upload').addEventListener('change', async function(e) {
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

async function processPDF(source) {
    pdfContainer.innerHTML = ''; 
    document.getElementById('analysis-results').innerHTML = '';
    const statusText = document.getElementById('ai-status');
    statusText.innerText = "جاري استخراج النص وتحليله ذكياً...";

    const loadingTask = pdfjsLib.getDocument(source);
    const pdf = await loadingTask.promise;

    // 1. استخراج النص من الصفحة الأولى للتحليل
    const firstPage = await pdf.getPage(1);
    const content = await firstPage.getTextContent();
    const extractedText = content.items.map(i => i.str).join(' ');

    // 2. إرسال النص لـ Gemini للحصول على تحليل حقيقي
    callGeminiAI(extractedText);

    // 3. عرض الصفحات للقراءة
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
}

async function callGeminiAI(textSnippet) {
    const resultsUl = document.getElementById('analysis-results');
    const statusText = document.getElementById('ai-status');

    const prompt = `أنت مساعد أكاديمي خبير. قم بتحليل النص التالي المستخرج من ورقة علمية واستخرج: 
    1. نوع الدراسة. 2. المشكلة الأساسية. 3. المنهجية المتبعة. 4. أهم النتائج. 
    اجعل الإجابة في نقاط قصيرة جداً وباللغة العربية. النص: ${textSnippet.substring(0, 2000)}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        statusText.style.display = 'none';
        // تحويل النص المستلم إلى قائمة نقاط
        aiResponse.split('\n').filter(line => line.trim()).forEach(line => {
            const li = document.createElement('li');
            li.innerText = line.replace('*', '•');
            li.style.marginBottom = "8px";
            resultsUl.appendChild(li);
        });
    } catch (error) {
        statusText.innerText = "حدث خطأ في الاتصال بالذكاء الاصطناعي.";
        console.error(error);
    }
}
