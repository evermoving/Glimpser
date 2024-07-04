document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status');
    const summaryElement = document.getElementById('summary');
    const summaryTypeSelect = document.getElementById('summary-type');
    const closePopupButton = document.getElementById('close-popup');

    statusElement.innerText = 'Select summary type and click to summarize';
    summaryElement.innerText = '';

    closePopupButton.addEventListener('click', () => {
        window.close();
    });

    document.body.addEventListener('click', (event) => {
        if (event.target.id === 'close-popup') return;

        statusElement.innerText = 'Processing...';
        summaryElement.innerText = '';

        const summaryType = summaryTypeSelect.value;

        browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {action: "extractText"})
                .then(response => {
                    if (response && response.text) {
                        return browser.runtime.sendMessage({
                            action: 'summarize',
                            data: response.text,
                            summaryType: summaryType
                        });
                    } else {
                        throw new Error('No text extracted');
                    }
                })
                .then(response => {
                    if (response.success && response.summary) {
                        statusElement.innerText = '';
                        summaryElement.innerText = response.summary;
                    } else {
                        throw new Error(response.error || 'No summary received');
                    }
                })
                .catch(error => {
                    statusElement.innerText = 'Error: ' + error.message;
                });
        });
    });
});