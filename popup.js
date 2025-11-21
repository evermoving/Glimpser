document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status');
    const summaryElement = document.getElementById('summary');
    const summaryTypeSelect = document.getElementById('summary-type');
    const summarizeButton = document.getElementById('summarize-button');
    const settingsButton = document.getElementById('settings-button');

    statusElement.innerText = 'Select summary type and click Summarize';
    summaryElement.innerText = '';

    settingsButton.addEventListener('click', () => {
        browser.runtime.openOptionsPage();
    });

    summarizeButton.addEventListener('click', () => {
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
                        summaryElement.innerHTML = formatSummary(response.summary);
                    } else {
                        throw new Error(response.error || 'No summary received');
                    }
                })
                .catch(error => {
                    statusElement.innerText = 'Error: ' + error.message;
                });
            });
            
            function formatSummary(text) {
                if (!text) return '';
            
                // Escape HTML characters
                let safeText = text.replace(/&/g, "&")
                                   .replace(/</g, "<")
                                   .replace(/>/g, ">");
            
                // Format Bold text: **text**
                safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
                // Split into lines
                const lines = safeText.split('\n');
                let html = '';
                let inList = false;
            
                lines.forEach(line => {
                    const trimmed = line.trim();
                    
                    // Check for bullet points
                    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                        if (!inList) {
                            html += '<ul>';
                            inList = true;
                        }
                        // Remove bullet marker
                        const content = trimmed.replace(/^[\*\-•]\s*/, '');
                        html += `<li>${content}</li>`;
                    } else {
                        if (inList) {
                            html += '</ul>';
                            inList = false;
                        }
                        if (trimmed.length > 0) {
                            html += `<p>${trimmed}</p>`;
                        }
                    }
                });
            
                if (inList) {
                    html += '</ul>';
                }
            
                return html;
            }
    });
});