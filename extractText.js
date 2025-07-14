        function extracTextFromPDF(event){
            //file is the input type- and exists in events array
            const file = event.target.files[0];
            if (!file) return;
            
            //PDF handling
            return new Promise( (res, rej) =>{
                const reader = new FileReader();
                //when reader reads a file
                reader.onload = async function(event) {
                    const arrayBuffer = event.target.result;
                    try {
                        //getDocument is a function to extract the pdf content
                        var pdf = pdfjsLib.getDocument({data: arrayBuffer});
                        pdf.promise.then(function (pdf) {
                          var totalPageCount = pdf.numPages;
                          var countPromises = [];

                          //extract text from each page
                          for ( var currentPage = 1; currentPage <= totalPageCount; currentPage++ ) 
                          {
                            var page = pdf.getPage(currentPage);
                            countPromises.push(
                              page.then(function (page) {
                                var textContent = page.getTextContent();
                                //concatenate all the text
                                return textContent.then(function (text) {
                                  return text.items.map(function (s) {
                                      return s.str;
                                    })
                                    .join(' ');
                                });
                              }),
                            );
                          }
                          //pass on all promises 
                          return Promise.all(countPromises).then(function (texts) {
                            const finalText = texts.join(' ');
                            console.log(texts);
                            document.getElementById("PDFContent").innerHTML = texts;
                            res(finalText);
                          });
                        });
                       } catch (error) {
                        console.log(error);
                        rej(error);
                       }
                };
                //convert PDF file to binary object
                reader.readAsArrayBuffer(file);
            });
        }

        //function for .txt files- create, add text, download with the PDF name
        async function createAndDownloadTXT(event) {

            const link = document.createElement("a");
            //extracTextFromPDF using
            const content = await extracTextFromPDF(event);
            // const file = event.target.files[0];
            const fileName = event.target.files[0].name ;
            //remove the postfix - .pdf for TXT name
            const base = fileName.slice(0, -4);
            console.log(base);
            const TXTFile = new Blob([content], { type: 'text/plain' });
            link.href = URL.createObjectURL(TXTFile);
            // download the TXT as PDF name
            link.download = base + ".txt";
            link.click();
            URL.revokeObjectURL(link.href);
        };


// export default createAndDownloadTXT;
window.createAndDownloadTXT = createAndDownloadTXT;