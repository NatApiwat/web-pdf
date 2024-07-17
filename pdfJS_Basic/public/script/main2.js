
function GetPDFShow(pdfData) {
    // const url = URL.createObjectURL(file);
    const { PDFDocument } = PDFLib
    const pdfjsLib = window['pdfjs-dist/build/pdf'];

    pdfjsLib.getDocument({ data: atob(pdfData.split(',')[1]) }).promise.then(pdf => {
        console.log('PDF loaded');

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            pdf.getPage(pageNumber).then(function (page) {
                const scale = 2;
                const viewport = page.getViewport({ scale: scale });

                const div = document.createElement('div');
                div.id = 'page-' + pageNumber;

                console.log('document :>> ', document.createElement);
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                canvas.style.width = (canvas.width / 2) + 'px'; // ลดขนาดการแสดงผลลงครึ่งหนึ่ง
                canvas.style.height = (canvas.height / 2) + 'px';

                const width =  canvas.style.width
                $("#pdf-container").css("width", width)
                console.log('width :>> ', width);
                // Render PDF page into canvas context
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                div.appendChild(canvas);
                document.getElementById('pdf-container').appendChild(div);

                page.render(renderContext).promise.then(() => {
                    console.log('Page ' + pageNumber + ' rendered');
                });
            });
        }
    }).catch(error => {
        console.error('Error loading PDF:', error);
    });

}

$(document).ready(function () {
    const { PDFDocument } = PDFLib
    
    
    let imageCounter = 0;
    const pdfData = sessionStorage.getItem('uploadedPDF');
    
    GetPDFShow(pdfData);

    //*Click Add Image
    $("#getUploadedImage").on("click", function () {
        document.getElementById('import-image').click();
    })

    //* import ไฟล์ ภาพ
    $("#import-image").on("change", function () {
        var file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = new Image();
                img.onload = function () {
                    // Create an img element
                    var newImg = document.createElement('img');
                    newImg.src = e.target.result;

                    // Optionally, set the size and position of the image
                    newImg.style.position = 'absolute';
                    newImg.style.left = '0px';
                    newImg.style.top = '0px';
                    // newImg.style.width = 500 + 'px';
                    // newImg.style.height = 500 + 'px';
                    newImg.style.width = img.width / 2 + 'px';
                    newImg.style.height = img.height / 2 + 'px';

                    // Set a unique id for the img element
                    newImg.id = 'image-' + imageCounter;
                    newImg.className = 'resize-drag';

                    imageCounter++; // Increment the counter for the next image

                    // Append the img element to the container holding the canvas
                    var container = document.getElementById('page-1');
                    container.appendChild(newImg);

                    console.log('Image imported and drawn on PDF with id:', newImg.id);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    })

    //* Download ไฟล์ PDF
    $('#download-pdf').on('click', async function () {
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const divs = document.querySelectorAll('div[id^="page-"]');


        // สร้างอาเรย์เพื่อเก็บ Canvas แต่ละอัน
        const canvases = [];

        // แปลง div เป็น Canvas และเก็บในอาเรย์
        for (const div of divs) {
            const canvas = await html2canvas(div);
            canvases.push(canvas);
        }

        // เพิ่ม Canvas ลงใน PDF
        for (let i = 0; i < canvases.length; i++) {
            const canvas = canvases[i];
            const imgDataUrl = canvas.toDataURL('image/png', 2.0); // คุณภาพสูงสุด
            const page = pdfDoc.addPage([canvas.width, canvas.height]);
            console.log('canvas.width', canvas.width)
            console.log('canvas.height', canvas.height)
            const imgData = await fetch(imgDataUrl).then(res => res.arrayBuffer());
            const img = await pdfDoc.embedPng(imgData);

            // วาดภาพลงบนหน้า PDF
            page.drawImage(img, {
                x: 0,
                y: 0,
                width: canvas.width + 80,
                height: canvas.height,
            });
        }

        // บันทึกเอกสาร PDF และดาวน์โหลด
        const pdfBytes = await pdfDoc.save();
        download(pdfBytes, "pdf-lib_Img2PDF.pdf", "application/pdf");
    });

    
    


})