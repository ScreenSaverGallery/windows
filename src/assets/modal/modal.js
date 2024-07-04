const { shell, contextBridge, ipcRenderer } = require('electron');
// import { shell, contextBridge, ipcRenderer } from 'electron';
// 
console.log('--------- ♥️ MODAL.JS ♥️ ---------');
// 
// 
contextBridge.exposeInMainWorld('action', {
    openLink: openLink,
    close: close,
    devMode: setDevMode,
    muted: setMuted,
    adult: setAdult
});
// 
function setDevMode(value) {
    sendMessage({'devMode': true, value: value});
}

function setMuted(value) {
    sendMessage({'muted': true, value: value});
}

function setAdult(value) {
    sendMessage({'adult': true, value: value});
}

function openLink(link) {
    shell.openExternal(link);
}

function sendMessage(message) {
    ipcRenderer.send('message', message);
}
