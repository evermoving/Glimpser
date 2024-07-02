//models: anthropic/claude-3-haiku (best), openchat/openchat-7b (poor)
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'summarize') {
        const articleText = message.data;
        console.log('Received article text:', articleText);
        
        if (!articleText) {
            console.error('No article text provided.');
            sendResponse({ success: false, error: 'No article text provided.' });
            return;
        }

        const prompt = 'Summarize the following article for personal research purposes, use bullet points:';
        const requestBody = JSON.stringify({
            model: 'anthropic/claude-3-haiku',
            messages: [
                { role: 'user', content: `${prompt}\n\n${articleText}` }
            ]
        });

        console.log('Request body:', requestBody);

        fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer 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`,
                'Content-Type': 'application/json'
            },
            body: requestBody
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

        // Ensure sendResponse is called asynchronously
        return true;
    }
});