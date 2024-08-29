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
        longPromptInput.value = result.longPrompt || 'Provide a comprehensive summary of the given text. The summary should cover all the key points and main ideas presented in the original text, while also condensing the information into a concise and easy-to-understand format. Please ensure that the summary includes relevant details and examples that support the main ideas, while avoiding any unnecessary information or repetition. The length of the summary should be appropriate for the length and complexity of the original text, providing a clear and accurate overview without omitting any important information. Text: ';
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