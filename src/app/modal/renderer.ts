// export interface ActionWindow extends Window {
//     action: any
// }
declare global {
    interface Window {
        action: any
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const searchParams = new URLSearchParams(window.location.search);
    const config = {
        devMode: searchParams.get('devMode') === 'true',
        sensitive: searchParams.get('sensitive') === 'true',
        muted: searchParams.get('muted') === 'true',
        lowVision: searchParams.get('lowVision') === 'true'
    }
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
    const lowVisionCheckboxElm: HTMLInputElement | null = document.querySelector('#low-vision-checkbox');
    if (lowVisionCheckboxElm) lowVisionCheckboxElm.checked = config.lowVision;
    
    const supportLinkElm: HTMLLinkElement | null = document.querySelector('#support');
    const contactLinkElm: HTMLLinkElement | null = document.querySelector('#contact');
    const callLinkElm: HTMLLinkElement | null = document.querySelector('#call');
    const closeElm: HTMLLinkElement | null = document.querySelector('#close');

    supportLinkElm?.addEventListener('click', () => {
        openLink(links.support);
    });
    contactLinkElm?.addEventListener('click', () => {
        openLink(links.contact);
    });
    callLinkElm?.addEventListener('click', () => {
        openLink(links.call);
    });
    muteCheckboxElm?.addEventListener('change', (event: any) => {
        muteChanged(event);
    });
    sensitiveCheckboxElm?.addEventListener('change', (event: any) => {
        sensitiveChanged(event);
    });
    lowVisionCheckboxElm?.addEventListener('change', (event: any) => {
        lowVisionChanged(event);
    });
    debugCheckboxElm?.addEventListener('change', (event: any) => {
        debugChanged(event);
    });
    closeElm?.addEventListener('click', () => {
        closeWindow();
    });
});


export function muteChanged(event: any) {
    const { checked } = event.target;
    // console.log('muteChanged checked?', checked);
    window.action.muted(checked);
}

export function sensitiveChanged(event: any) {
    const { checked } = event.target;
    window.action.sensitive(checked);
}

export function debugChanged(event: any) {
    const { checked } = event.target;
    window.action.devMode(checked);
}

export function lowVisionChanged(event: any) {
    const { checked } = event.target;
    window.action.lowVision(checked);
}

export function openLink(link: string) {
    window.action.openLink(link);
}

export function closeWindow() {
    window.close();
    return true;
}