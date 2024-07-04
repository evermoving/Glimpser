browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'summarize') {
        const articleText = message.data;
        console.log('Received article text:', articleText);
        
        if (!articleText) {
            console.error('No article text provided.');
            sendResponse({ success: false, error: 'No article text provided.' });
            return true;
        }

        browser.storage.sync.get(['model', 'apiKey', 'prompt']).then((result) => {
            const model = result.model || 'anthropic/claude-3-haiku';
            const apiKey = result.apiKey;
            const prompt = result.prompt || 'Summarize the following article for personal research purposes, use bullet points:';

            if (!apiKey) {
                sendResponse({ success: false, error: 'API key not provided. Right click on the extension -> Manage extension -> Three dots -> Options.' });
                return;
            }

            const requestBody = JSON.stringify({
                model: model,
                messages: [
                    { role: 'user', content: `${prompt}\n\n${articleText}` }
                ]
            });

            console.log('Request body:', requestBody);

            return fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: requestBody
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received response from API:', data);
            const summary = data.choices[0].message.content;
            console.log('Summary:', summary);
            sendResponse({ success: true, summary: summary });
        })
        .catch(error => {
            console.error('Error:', error);
            sendResponse({ success: false, error: error.message });
        });

        // Indicate that we will send a response asynchronously
        return true;
    }
});