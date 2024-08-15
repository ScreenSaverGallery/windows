// export interface ActionWindow extends Window {
//     action: any
// }
declare global {
    interface Window {
        action: any
    }
}

export class ConfigModal {
    constructor(){}

    muteChanged(event: any) {
        const { checked } = event.target;
        // console.log('muteChanged checked?', checked);
        window.action.muted(checked);
    }

    sensitiveChanged(event: any) {
        const { checked } = event.target;
        window.action.sensitive(checked);
    }

    debugChanged(event: any) {
        const { checked } = event.target;
        window.action.devMode(checked);
    }
    
    voiceOverChanged(event: any) {
        const { checked } = event.target;
        window.action.voiceOver(checked);
    }
    
    openLink(link: string) {
        window.action.openLink(link);
    }
    
    closeWindow() {
        window.action.close();
        window.close();
        return true;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const searchParams = new URLSearchParams(window.location.search);
    const config = {
        devMode: searchParams.get('devMode') === 'true',
        sensitive: searchParams.get('sensitive') === 'true',
        muted: searchParams.get('muted') === 'true',
        voiceOver: searchParams.get('voiceOver') === 'true',
        version: searchParams.get('version')
    }
    console.log('APP VERSION IN CONFIG', config.version);
    const links = {
        support: 'https://screensaver.gallery/support-us?app=win',
        contact: 'https://discord.com/invite/QJtRUYptRR',
        call: 'https://screensaver.gallery/continuous-open-call?app=win'
    }
    const muteCheckboxElm: HTMLInputElement | null = document.querySelector('#mute-checkbox');
    if (muteCheckboxElm) muteCheckboxElm.checked = config.muted;
    const sensitiveCheckboxElm : HTMLInputElement | null = document.querySelector('#sensitive-checkbox');
    if (sensitiveCheckboxElm) sensitiveCheckboxElm.checked = config.sensitive;
    const debugCheckboxElm : HTMLInputElement | null = document.querySelector('#debug-checkbox');
    if (debugCheckboxElm) debugCheckboxElm.checked = config.devMode;
    const voiceOverCheckboxElm: HTMLInputElement | null = document.querySelector('#voice-over-checkbox');
    if (voiceOverCheckboxElm) voiceOverCheckboxElm.checked = config.voiceOver;

    const supportLinkElm: HTMLLinkElement | null = document.querySelector('#support');
    const contactLinkElm: HTMLLinkElement | null = document.querySelector('#contact');
    const callLinkElm: HTMLLinkElement | null = document.querySelector('#call');
    const closeElm: HTMLLinkElement | null = document.querySelector('#close');
    const versionElm: HTMLElement | null = document.querySelector('.version');

    if (versionElm && config.version) versionElm.innerHTML = `<small>v${decodeURIComponent(config.version)}</small>`

    const modal = new ConfigModal();

    supportLinkElm?.addEventListener('click', () => {
        modal.openLink(links.support);
    });
    contactLinkElm?.addEventListener('click', () => {
        modal.openLink(links.contact);
    });
    callLinkElm?.addEventListener('click', () => {
        modal.openLink(links.call);
    });
    muteCheckboxElm?.addEventListener('change', (event: any) => {
        modal.muteChanged(event);
    });
    sensitiveCheckboxElm?.addEventListener('change', (event: any) => {
        modal.sensitiveChanged(event);
    });
    voiceOverCheckboxElm?.addEventListener('change', (event: any) => {
        modal.voiceOverChanged(event);
    });
    debugCheckboxElm?.addEventListener('change', (event: any) => {
        modal.debugChanged(event);
    });
    closeElm?.addEventListener('click', () => {
        modal.closeWindow();
    });
});