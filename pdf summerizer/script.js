function generateSummary() {
    const fileInput = document.getElementById('pdfFile');
    const summaryDiv = document.getElementById('summary');

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        // Use PDF.js to read the PDF file
        const loadingTask = pdfjsLib.getDocument({data: event.target.result});
        loadingTask.promise.then(function(pdf) {
            // Assume we want to summarize the first page only
            pdf.getPage(1).then(function(page) {
                // Extract text from the page
                page.getTextContent().then(function(textContent) {
                    // Concatenate all the text items into a single string
                    let text = textContent.items.map(item => item.str).join(' ');

                    // Split the text into sentences
                    let sentences = text.match(/[^.!?]+[.!?]+/g);

                    // Check if there are sentences to summarize
                    if (sentences) {
                        // Adjust the number here to change the number of sentences in the summary
                        let summarySentences = sentences.slice(0, 5); // Number of sentences to include in the summary

                        // Create a list of sentences
                        let summary = summarySentences.map(sentence => '<li>' + sentence.trim() + '</li>').join('');

                        // Display the summary as a list in the 'summary' div
                        summaryDiv.innerHTML = '<ul>' + summary + '</ul>';
                    } else {
                        // If no sentences are found, display the original text
                        summaryDiv.textContent = text;
                    }

                    // Print the summary
                    window.print();
                });
            });
        }, function(reason) {
            // PDF loading error
            console.error(reason);
        });
    };

    reader.readAsArrayBuffer(file);
}
