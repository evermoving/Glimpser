function extractText() {
    let articleText = '';
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach((p) => {
        articleText += p.innerText + '\n';
    });
    return articleText.trim();
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractText') {
        const articleText = extractText();
        sendResponse({text: articleText});
    }
});