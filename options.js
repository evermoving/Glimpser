document.addEventListener('DOMContentLoaded', () => {
    const modelInput = document.getElementById('model');
    const apiKeyInput = document.getElementById('apiKey');
    const promptInput = document.getElementById('prompt');
    const saveButton = document.getElementById('save');
    const statusDiv = document.getElementById('status');

    // Load saved settings
    browser.storage.sync.get(['model', 'apiKey', 'prompt'], (result) => {
        modelInput.value = result.model || 'anthropic/claude-3-haiku';
        apiKeyInput.value = result.apiKey || '';
        promptInput.value = result.prompt || 'Summarize the following article for personal research purposes, use bullet points:';
    });

    // Save settings
    saveButton.addEventListener('click', () => {
        browser.storage.sync.set({
            model: modelInput.value,
            apiKey: apiKeyInput.value,
            prompt: promptInput.value
        }, () => {
            statusDiv.textContent = 'Settings saved!';
            setTimeout(() => {
                statusDiv.textContent = '';
            }, 3000);
        });
    });
});