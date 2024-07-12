import { shell, contextBridge, ipcRenderer } from 'electron';
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
    sensitive: setSensitive
});
// 
function setDevMode(value: boolean) {
    sendMessage({'devMode': true, value: value});
}

function setMuted(value: boolean) {
    sendMessage({'muted': true, value: value});
}

function setSensitive(value: boolean) {
    sendMessage({'sensitive': true, value: value});
}

function openLink(link: string) {
    shell.openExternal(link);
}

function sendMessage(message: any) {
    ipcRenderer.send('message', message);
}
