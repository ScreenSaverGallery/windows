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
        adult: searchParams.get('adult') === 'true',
        muted: searchParams.get('muted') === 'true'
    }
    const links = {
        support: 'https://screensaver.gallery/support-us?app=win',
        contact: 'https://discord.com/invite/QJtRUYptRR',
        call: 'https://screensaver.gallery/continuous-open-call?app=win'
    }
    const muteCheckboxElm: HTMLInputElement | null = document.querySelector('#mute-checkbox');
    if (muteCheckboxElm) muteCheckboxElm.checked = config.muted;
    const adultCheckboxElm : HTMLInputElement | null = document.querySelector('#adult-checkbox');
    if (adultCheckboxElm) adultCheckboxElm.checked = config.adult;
    const debugCheckboxElm : HTMLInputElement | null = document.querySelector('#debug-checkbox');
    if (debugCheckboxElm) debugCheckboxElm.checked = config.devMode;
    
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
    adultCheckboxElm?.addEventListener('change', (event: any) => {
        adultChanged(event);
    });
    debugCheckboxElm?.addEventListener('change', (event: any) => {
        debugChanged(event);
    });
    closeElm?.addEventListener('click', () => {
        closeWindow();
    });

    console.log('config', config);
});


export function muteChanged(event: any) {
    const { checked } = event.target;
    // console.log('muteChanged checked?', checked);
    window.action.muted(checked);
}

export function adultChanged(event: any) {
    const { checked } = event.target;
    window.action.adult(checked);
}

export function debugChanged(event: any) {
    const { checked } = event.target;
    window.action.devMode(checked);
}

export function openLink(link: string) {
    window.action.openLink(link);
    // console.log('openLink modal.html', link);
}

export function closeWindow() {
    // window.action.close();
    console.log('closeWindow');
    window.close();
    return true;
}