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
            renderPDF(url);
        } catch (error) {
            alert("فشل تحميل الملف. تأكد أن الرابط مباشر ويدعم CORS.");
        }
    }
}

// 3. وظيفة الرسم (Rendering)
async function renderPDF(source) {
    pdfContainer.innerHTML = ''; // تفريغ الحاوية
    const loadingTask = pdfjsLib.getDocument(source);
    const pdf = await loadingTask.promise;
    
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