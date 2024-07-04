// import { app } from 'electron';
import { autoUpdater } from 'electron-updater';
import { SSG_URL_UPDATE_USER, SSG_URL_UPDATE_ADMIN } from './env';

export class Updater {
    au = autoUpdater;
    constructor(){
        this.init();
    }

    private init() {
        this.au.autoDownload = true;

        this.au.setFeedURL({
            provider: 'generic',
            url: SSG_URL_UPDATE_USER
        });
        this.listen();
    }

    check() {
        this.au.checkForUpdates();
    }

    private listen() {
        this.au.on('checking-for-update', () => {
            this.sendStatusToWindow('Checking for update...');
        });
        this.au.on('update-available', (info: any) => {
            this.sendStatusToWindow('Updates available.');
        });
        this.au.on('update-not-available', (info: any) => {
            this.sendStatusToWindow('Update not available.');
        });
        this.au.on('error', (err: any) => {
            this.sendStatusToWindow('Error in auto-updater.');
        });
        this.au.on('download-progress', (progressObj: any) => {
            let log_message = `Download speed: ${progressObj.bytesPerSecond}.`;
            log_message += ` Downloaded ${parseInt(progressObj.percent)}%`;
            log_message += ` ${progressObj.transferred}/${progressObj.total}`;
            this.sendStatusToWindow(log_message);
        });
        this.au.on('update-downloaded', (info: any) => {
            this.sendStatusToWindow('Update downloaded: will install in 1 second.');
            setTimeout(() => {
                this.au.quitAndInstall(true); // isSilent
            }, 1000);
        });
    }

    private sendStatusToWindow(message: any): void {
        console.log(message);
    }
}
