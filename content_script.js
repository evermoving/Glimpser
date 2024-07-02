function extractText() {
    let articleText = '';
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach((p) => {
        articleText += p.innerText + '\n';
    });
    return articleText.trim();
}

const articleText = extractText();
console.log('Extracted article text:', articleText);

// Send the extracted text to the background script
browser.runtime.sendMessage({ action: 'sendText', data: articleText })
    .then(response => {
        console.log('Message sent to background:', response);
    })
    .catch(error => {
        console.error('Error sending message to background:', error);
    });
