document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the phishingScore from storage when the popup is opened
    chrome.storage.local.get('phishingScore', function (result) {
        const phishingScore = result.phishingScore || 0;
        if (phishingScore === 1) {

            const element1 = document.getElementById("safe");
            element1.src = "warn.gif";

            const element2 = document.getElementById("text");
            element2.innerHTML = "Phishing Alert";
            chrome.action.openPopup();
        }
    });
});