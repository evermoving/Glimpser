// content_script.js

// Include the Readability.js script
const script = document.createElement('script');
script.src = browser.runtime.getURL('libs/readability.js');
document.head.appendChild(script);

function extractText() {
    const documentClone = document.cloneNode(true);
    const article = new Readability(documentClone).parse();
    return article ? article.textContent : '';
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractText') {
        const articleText = extractText();
        sendResponse({ text: articleText });
    }
});
