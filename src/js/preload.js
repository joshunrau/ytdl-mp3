const { ipcRenderer } = require("electron");

// This event will be triggered when all of the HTML is loaded
window.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById("download-button");
    const urlBox = document.getElementById("url-box");

    const tags = {
        title: document.getElementById("title-box").value,
        artist: document.getElementById("artist-box").value,
        album: document.getElementById("album-box").value
    };

    downloadButton.addEventListener("click", () => {
        ipcRenderer.send("download-triggered", urlBox.value, tags);
    });
});