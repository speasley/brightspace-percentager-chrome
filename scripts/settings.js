const showStatusMessage = (message) => {
    const status = document.getElementById('statusMessage');
    status.textContent = message;
    status.classList.remove('fade-out');

    setTimeout(() => {
        status.classList.add('fade-out');
    }, 2000);

    setTimeout(() => {
        status.textContent = '';
    }, 3000);
}

const updateInputWithStoredValue = () => {
    chrome.storage.sync.get('userPercent', (data) => {
        if (data.userPercent !== undefined) {
            document.getElementById('percent').value = data.userPercent;
        }
    });
}
document.getElementById('saveButton').addEventListener('click', (event) => {
    event.preventDefault();
    const numberValue = document.getElementById('percent').value;
    chrome.storage.sync.set({ 'userPercent': numberValue }, () => {
        showStatusMessage('Settings saved.');
        chrome.runtime.sendMessage({ action: "updateSettings", userPercent: numberValue });
    });
});

updateInputWithStoredValue();
