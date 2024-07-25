
$(document).ready(function () {
    const { PDFDocument } = PDFLib
    const pdfjsLib = window['pdfjs-dist/build/pdf'];

    $("#getUploadedPDF").on("click", function () {
        document.getElementById('uploadPDF').click();
    })

    $("#uploadPDF").on("change", function () {
        const fileInput = $("#uploadPDF")[0];
        const file = fileInput.files[0];

        if(typeof file === 'undefined'){
            console.log('no file')
        }else{
            $("#target").removeClass('hidden')

        //* animation send
        $("#target").addClass('animate')
        
        setTimeout(function () {
            $("#getUploadedPDF").addClass('animate_button')
        },2400)

        setTimeout(function () {
        console.log('fileInput', file)
        const reader = new FileReader();
        reader.onload = function (e) {
            const pdfData = e.target.result;

            // Store PDF data in sessionStorage
            sessionStorage.setItem('uploadedPDF', pdfData);
            console.log('PDF uploaded and stored in sessionSorage.');

            // Redirect to main_2.html after file upload
            window.location.href = 'main_2';
        };
        reader.readAsDataURL(file);
        },3500)
        }
        
    });

        //* eyes animation
        const elements = document.querySelectorAll('.eyes_animate');
  
        elements.forEach(element => {
          function startAnimation() {
            element.style.animation = 'eyes 0.2s linear';
            element.addEventListener('animationend', () => {
              element.style.animation = 'none';
              setTimeout(startAnimation, 5000); // Delay 5 seconds
            }, { once: true });
          }
  
          startAnimation();
        });

        //* catSleep animation
        const catSleepingElements = document.querySelectorAll('.catSleeping');
        catSleepingElements.forEach((element, index) => {
            element.style.setProperty('--animation-delay', `${index * 1.5}s`);
        });

});