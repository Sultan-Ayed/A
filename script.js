const pdfContainer = document.getElementById('pdf-container');
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// 1. التعامل مع رفع الملف من الجهاز
document.getElementById('file-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            const typedarray = new Uint8Array(this.result);
            renderPDF(typedarray);
        };
        reader.readAsArrayBuffer(file);
    }
});

// 2. التعامل مع الرابط الخارجي
async function loadFromURL() {
    const url = document.getElementById('url-input').value;
    if (url) {
        try {
            // ملاحظة: قد تحتاج لـ Proxy إذا كان الموقع يمنع CORS
            renderPDF(url);
        } catch (error) {
            alert("فشل تحميل الملف. تأكد أن الرابط مباشر ويدعم الوصول العام.");
        }
    }
}

// 3. وظيفة الرسم المطورة مع طبقة النصوص
async function renderPDF(source) {
    pdfContainer.innerHTML = ''; // تفريغ الحاوية
    
    try {
        const loadingTask = pdfjsLib.getDocument(source);
        const pdf = await loadingTask.promise;
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });

            // إنشاء حاوية لكل صفحة (تجمع بين الـ Canvas والنصوص)
            const pageWrapper = document.createElement('div');
            pageWrapper.className = 'page-wrapper';
            pageWrapper.style.position = 'relative';
            pageWrapper.style.marginBottom = '20px';
            pageWrapper.style.display = 'inline-block';
            
            // إنشاء الـ Canvas للرسم
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            pageWrapper.appendChild(canvas);

            // رسم الصفحة (Visual)
            await page.render({ canvasContext: context, viewport: viewport }).promise;

            // إنشاء طبقة النصوص (Text Layer) لتمكين التحديد والنسخ
            const textContent = await page.getTextContent();
            const textLayerDiv = document.createElement('div');
            textLayerDiv.className = 'textLayer';
            textLayerDiv.style.position = 'absolute';
            textLayerDiv.style.top = '0';
            textLayerDiv.style.left = '0';
            textLayerDiv.style.height = `${viewport.height}px`;
            textLayerDiv.style.width = `${viewport.width}px`;
            textLayerDiv.style.overflow = 'hidden';
            textLayerDiv.style.lineHeight = '1.0';

            // دمج مكتبة النص مع المتصفح
            pdfjsLib.renderTextLayer({
                textContent: textContent,
                container: textLayerDiv,
                viewport: viewport,
                textDivs: []
            });

            pageWrapper.appendChild(textLayerDiv);
            pdfContainer.appendChild(pageWrapper);
        }
    } catch (err) {
        console.error("Error rendering PDF:", err);
    }
}
