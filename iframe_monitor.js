// P1001 error detection
const checkError = () => {
    if (document.body && document.body.innerText.includes('P1001')) {
        window.top.postMessage('JRA_P1001_ERROR', '*');
        return true;
    }
    return false;
};

if (!checkError()) {
    const observer = new MutationObserver(() => {
        if (checkError()) {
            observer.disconnect();
        }
    });
    

    observer.observe(document, { childList: true, subtree: true });
}