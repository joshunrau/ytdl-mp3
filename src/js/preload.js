const { ipcRenderer } = require("electron");

// This event will be triggered when all of the HTML is loaded
window.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById("download-button");
    const urlBox = document.getElementById("url-box");

    downloadButton.addEventListener("click", () => {
        const tags = {
            title: document.getElementById("title-box").value,
            artist: document.getElementById("artist-box").value,
            album: document.getElementById("album-box").value
        };
        ipcRenderer.send("download-triggered", urlBox.value, tags);
    });
});