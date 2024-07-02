document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('status').innerText = 'Processing...';

    // Fetch the summary from local storage
    browser.storage.local.get('summary', (result) => {
        if (browser.runtime.lastError) {
            document.getElementById('status').innerText = 'Error processing request.';
            console.error('Error:', browser.runtime.lastError);
        } else {
            document.getElementById('status').innerText = '';
            if (result.summary) {
                document.getElementById('summary').innerText = result.summary;
            } else {
                document.getElementById('summary').innerText = 'No summary available.';
            }
        }
    });
});
