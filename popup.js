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
                        // Clear existing content
                        while (summaryElement.firstChild) {
                            summaryElement.removeChild(summaryElement.firstChild);
                        }
                        // Append new content safely
                        const formattedNodes = formatSummary(response.summary);
                        formattedNodes.forEach(node => summaryElement.appendChild(node));
                    } else {
                        throw new Error(response.error || 'No summary received');
                    }
                })
                .catch(error => {
                    statusElement.innerText = 'Error: ' + error.message;
                });
            });
            
            function formatSummary(text) {
                if (!text) return [];
            
                const nodes = [];
                const lines = text.split('\n');
                let currentList = null;
            
                lines.forEach(line => {
                    const trimmed = line.trim();
                    
                    // Check for bullet points
                    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                        if (!currentList) {
                            currentList = document.createElement('ul');
                            nodes.push(currentList);
                        }
                        
                        const li = document.createElement('li');
                        // Remove bullet marker
                        const content = trimmed.replace(/^[\*\-•]\s*/, '');
                        parseAndAppendContent(li, content);
                        currentList.appendChild(li);
                    } else {
                        currentList = null;
                        if (trimmed.length > 0) {
                            const p = document.createElement('p');
                            parseAndAppendContent(p, trimmed);
                            nodes.push(p);
                        }
                    }
                });
            
                return nodes;
            }

            function parseAndAppendContent(element, text) {
                // Split by bold markers **text**
                const parts = text.split(/(\*\*.*?\*\*)/g);
                
                parts.forEach(part => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        const strong = document.createElement('strong');
                        strong.textContent = part.slice(2, -2);
                        element.appendChild(strong);
                    } else if (part.length > 0) {
                        element.appendChild(document.createTextNode(part));
                    }
                });
            }
    });
});