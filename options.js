document.addEventListener('DOMContentLoaded', () => {
    const modelInput = document.getElementById('model');
    const apiKeyInput = document.getElementById('apiKey');
    const shortPromptInput = document.getElementById('shortPrompt');
    const longPromptInput = document.getElementById('longPrompt');
    const saveButton = document.getElementById('save');
    const statusDiv = document.getElementById('status');

    // Load saved settings
    browser.storage.sync.get(['model', 'apiKey', 'shortPrompt', 'longPrompt'], (result) => {
        modelInput.value = result.model || 'anthropic/claude-3-haiku';
        apiKeyInput.value = result.apiKey || '';
        shortPromptInput.value = result.shortPrompt || 'Summarize the following article for personal research purposes, use bullet points:';
        longPromptInput.value = result.longPrompt || 'Summarise comprehensively';
    });

    // Save settings
    saveButton.addEventListener('click', () => {
        browser.storage.sync.set({
            model: modelInput.value,
            apiKey: apiKeyInput.value,
            shortPrompt: shortPromptInput.value,
            longPrompt: longPromptInput.value
        }, () => {
            statusDiv.textContent = 'Settings saved!';
            setTimeout(() => {
                statusDiv.textContent = '';
            }, 3000);
        });
    });
});