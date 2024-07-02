function extractText() {
    let articleText = '';
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach((p) => {
        articleText += p.innerText + '\n';
    });
    return articleText.trim();
}

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'extractText') {
        const articleText = extractText();
        console.log('Extracted article text:', articleText);
        // Send the extracted text to the background script
        browser.runtime.sendMessage({ action: 'sendText', data: articleText });
    }
});
