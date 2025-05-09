const {
    PDFDocument
} = PDFLib

//* โหลด PDF ด้วย `pdf.js`
const pdfjsLib = window['pdfjs-dist/build/pdf'];

//* ปุ่มเพิ่ม PDF
document.getElementById('getUploadedPDF').addEventListener('click', function() {
    document.getElementById('uploadPDF').click();
});

//* upload PDF
document.getElementById('uploadPDF').addEventListener('change', function(event) {
    
    $('#pdf-container').empty();
    $('#pdf-container').removeClass('d-none');
    
    //* รับไฟล์มาจาก upload
    const fileInput = $("#uploadPDF")[0]
    const file = fileInput.files[0];
    // Fetch an existing PDF document
    const url = URL.createObjectURL(file); //Pdf File

    //* เริ่มต้นโหลดไฟล์ PDF
    pdfjsLib.getDocument(url).promise.then(function(pdf) {
    
    //==================================================== 
    for(let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        pdf.getPage(pageNumber).then(function(page) {
            var scale = 1.5;
            var viewport = page.getViewport({ scale: scale });

            // กำหนด div
            var div = document.createElement('div');
            div.id = 'page-' + pageNumber;

            // กำหนด Canvas
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // เตรียมการวาดหน้า PDF ลงบน Canvas
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };

             // เอา canvas ใส่ div
            div.appendChild(canvas);
            document.getElementById('pdf-container').appendChild(div);

            page.render(renderContext).promise.then(function () {
                console.log('Page ' + pageNumber + ' rendered');
            });
        });
    }
});
});

//* Download ไฟล์ PDF
document.getElementById('download-pdf').addEventListener('click', async function() {
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
        const imgDataUrl = canvas.toDataURL('image/png', 1.0); // คุณภาพสูงสุด
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

//* ปุ่มเพิ่มรูปภาพ
document.getElementById('getUploadedImage').addEventListener('click', function() {
    document.getElementById('import-image').click();
});

let imageCounter = 0; // Counter to keep track of the number of images

// //* import ไฟล์ ภาพ
document.getElementById('import-image').addEventListener('change', function(event) {
 

var file = event.target.files[0];
if (file && file.type.startsWith('image/')) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
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

});


//* functions ลากวางภาพบน PDF ===================================================================================
// หยุดการดำเนินการเริ่มต้นสำหรับอีเวนต์ที่เกี่ยวข้องกับการลากและปล่อย
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// เพิ่มอีเวนต์สำหรับการลากและปล่อยใน drop-area
var dropArea = document.getElementById('pdf-container');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

// เพิ่มอีเวนต์เพื่อเปลี่ยนรูปแบบเมื่อมีการลากไฟล์เข้ามาในพื้นที่ drop-area
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => {
        dropArea.style.backgroundColor = '#f0f0f0';
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => {
        dropArea.style.backgroundColor = '';
    }, false);
});

// อีเวนต์สำหรับการปล่อยไฟล์ลงใน drop-area
dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    var dt = e.dataTransfer;
    var files = dt.files;

    handleFiles(files);
}

function handleFiles(files) {
    if (files.length > 0) {
        var file = files[0];
        if (file.type.startsWith('image/')) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = new Image();
                img.onload = function() {
                    // กำหนดตำแหน่งและขนาดของรูปภาพที่ต้องการ
                    // Optionally, set the size and position of the image
                    img.style.position = 'absolute';
                    img.style.left = '0px'; // ตำแหน่ง x
                    img.style.top = '0px'; // ตำแหน่ง y
                    img.style.width = img.width / 2 + 'px'; // ความกว้างของรูปภาพ
                    img.style.height = img.height / 2 + 'px';// ความสูงของรูปภาพ

                    // Set a unique id for the img element
                    img.id = 'image-' + imageCounter;
                    img.className = 'resize-drag';
                    
                    imageCounter++; // Increment the counter for the next image

                    // เลือก container ที่ต้องการเพิ่มรูปภาพ
                    var container = document.getElementById('page-1');
                    container.appendChild(img);

                    console.log('Image imported and added to PDF container via drag and drop');
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
}


//* Library Drag and Drop interact.js ===================================================================================

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

// this function is used later in the resizing and gesture demos
// window.dragMoveListener = dragMoveListener

interact('.resize-drag')
  .resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },

    listeners: {
      move (event) {
        var target = event.target
        var x = (parseFloat(target.getAttribute('data-x')) || 0)
        var y = (parseFloat(target.getAttribute('data-y')) || 0)

        // update the element's style
        target.style.width = event.rect.width + 'px'
        target.style.height = event.rect.height + 'px'

        // translate when resizing from top or left edges
        x += event.deltaRect.left
        y += event.deltaRect.top

        target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
        target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
      }
    },
    modifiers: [
      // keep the edges inside the parent
      interact.modifiers.restrictEdges({
        outer: 'parent'
      }),

      // minimum size
      interact.modifiers.restrictSize({
        min: { width: 100, height: 50 }
      })
    ],

    inertia: true
  })
  .draggable({
    listeners: { 
        move: window.dragMoveListener,
        // call this function on every dragend event
        end (event) {
        // var textEl = event.target.querySelector('p')

        // textEl && (textEl.textContent =
        //   'moved a distance of ' +
        //   (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
        //              Math.pow(event.pageY - event.y0, 2) | 0))
        //     .toFixed(2) + 'px')
        console.log("HelloWorldddd")
        
      }
    },
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ]
  })

$(".resize-drag").click(function(){
    $(".resize-drag").hide();
  });