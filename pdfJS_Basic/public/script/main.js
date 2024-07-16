
$(document).ready(function () {
    const { PDFDocument } = PDFLib
    const pdfjsLib = window['pdfjs-dist/build/pdf'];

    $("#getUploadedPDF").on("click", function () {
        document.getElementById('uploadPDF').click();
    })

    $("#uploadPDF").on("change", function () {
        const fileInput = $("#uploadPDF")[0];
        const file = fileInput.files[0];

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
    });


});