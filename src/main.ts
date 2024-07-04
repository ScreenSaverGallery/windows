import { app, BrowserWindow } from 'electron';
import * as remote from '@electron/remote/main';
import { ipcMain } from 'electron';
import { Store } from './app/store';
import { ScreenSaverGallery } from './app/screen-saver-gallery';
import { Updater } from './app/updater';
import { v4 as uuidv4 } from 'uuid'; // module not found error
import * as path from 'path';
import * as ChildProcess from 'child_process';

// 🐶 TODO: add Tray (see: https://electronjs.org/docs/latest/api/tray)

declare const CONFIG_WINDOW_WEBPACK_ENTRY: string;
declare const CONFIG_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	app.quit();
}
// initialize remote
remote.initialize();

// app
// CRUCIAL !! ALLOW AUTOPLAY ON MEDIA
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

// updater
const updater = new Updater();
updater.check();

// app user data storage
const store: Store = new Store({
	userDataPath: app.getPath('userData'),
	configName: 'config',
	defaults: { devMode: false, muted: false, adult: false, id: undefined }
});
// remote window – ssg options
const remoteWindow = ipcMain;
// devMode
let devMode = store.getDevMode;
const adult = store.getAdult;
const muted = store.getMuted;
if (!store.getId) store.setId = uuidv4(); // set id for navigator if not set

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	app.quit();
});

app.on("ready", () => {
	console.log('argv', process.argv); 
	console.log('app.isPacked?', app.isPackaged);
	

	remoteWindow.on('message', (event: any, data: any) => {
		console.log('data', data);
		if (data.devMode) store.setDevMode = data.value;
		if (data.adult) store.setAdult = data.value;
		if (data.muted) store.setMuted = data.value;
	});
	
	const argNum = 1; // in production it is 1, for dev set 2
	console.log('CONFIG_WINDOW_PRELOAD_WEBPACK_ENTRY', CONFIG_WINDOW_PRELOAD_WEBPACK_ENTRY);
	console.log('CONFIG_WINDOW_WEBPACK_ENTRY', CONFIG_WINDOW_WEBPACK_ENTRY);
	if(process.argv.length > 1) {
		/* OPTIONS DIALOG (MODAL) */
		if ( process.argv[argNum] === "/C" || process.argv[argNum].match(/^\/c/)) { // configuration
			const modal = new BrowserWindow({
				width: 700, 
				height: 400, 
				webPreferences: {
					sandbox: false,
					nodeIntegration: true,
					preload: CONFIG_WINDOW_PRELOAD_WEBPACK_ENTRY, // `${__dirname}/assets/modal/modal.js`,
					contextIsolation: true,
					devTools: false
				},
				show: false,
				frame: false
			});
			// no window menu
			modal.setMenu(null);
			remote.enable(modal.webContents);
			const modalUrl = "file://" + __dirname + "/assets/modal/modal.html";
			// modal.loadURL(`${modalUrl}?devMode=${devMode}&muted=${muted}&adult=${adult}`);
			modal.loadURL(`${CONFIG_WINDOW_WEBPACK_ENTRY}?devMode=${devMode}&muted=${muted}&adult=${adult}`);
			// modal.loadURL(CONFIG_WINDOW_WEBPACK_ENTRY, {});
			// modal.webContents.openDevTools(); // temp

			modal.once('ready-to-show', () => {
				modal.show();
			});

			modal.on('close', () => {
				app.quit();
			});

			return;
		}
		/* PREVIEW */
		// TODO: https://support.microsoft.com/en-ca/help/182383/info-screen-saver-command-line-arguments
		// The /p option tells us to display the screen saver in the tiny preview window in the Screen Saver Settings dialog.
		else if ( process.argv[argNum].match(/^\/p/)) { // preview
			app.quit();
			// try child window
			// not works :( showing new window under the properties panel, should be inside image of monitor
			// const preview = new ScreenSaverGallery(true, devMode, store);
			// preview.init();
			return;
		/* SCREENSAVER */
		} else {
			const execPath = path.resolve(process.execPath);
			registerScreenSaver(execPath, true);
			const ssg = new ScreenSaverGallery(false, devMode, store);
			ssg.init();
		}

		// The /a option change password, modal to window.
		/* else if (process.argv[1] === "/a")
		{
			app.quit();
			return;
		} */

		// The /S option is passed when the user chooses Configure from the .scr file context menu (although we don't see this in practice).
		// The /c:# option is passed when the user clicks Settings... in the Screen Saver Settings dialog.
		
	}
});

function registerScreenSaver(scrPath: string, add: boolean): void {
	if (add) {
		const hkey_user = "HKEY_CURRENT_USER\\Control\ Panel\\Desktop";
		// set for current user (setup every time screensavergallery runs)
		try {
			ChildProcess.execSync(`REG ADD "${hkey_user}" /v SCRNSAVE.EXE /t REG_SZ /d "${scrPath}" /f`);
			ChildProcess.execSync(`REG ADD "${hkey_user}" /v ScreenSaveActive /t REG_SZ /d 1 /f`);
			// set once while install ChildProcess.execSync(`REG ADD "${hkey_user}" /v ScreenSaveTimeOut /t REG_SZ /d 360 /f`); // 360 = 60 * 6 = 6min	
		} catch(e) {
			console.log('error', e);
		}
			
	}
}
