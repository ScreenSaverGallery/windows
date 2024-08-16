import { app, BrowserWindow } from 'electron';
import * as remote from '@electron/remote/main';
import { ipcMain } from 'electron';
import { Store } from './app/store';
import { ScreenSaverGallery } from './app/screen-saver-gallery';
import { v4 as uuidv4 } from 'uuid'; // module not found error
import * as path from 'path';
import * as ChildProcess from 'child_process';
import { updateElectronApp, UpdateSourceType } from 'update-electron-app'

// 🐶 TODO: add Tray? (see: https://electronjs.org/docs/latest/api/tray)

// update from github releases
updateElectronApp({
	updateSource: {
		type: UpdateSourceType.ElectronPublicUpdateService,
		repo: 'ScreenSaverGallery/windows', // default from package.json ... see (watch) bug: https://github.com/electron/update-electron-app/issues/155
		host: 'https://github.com' // host has to be set to avoid error... not tested yet if it download latest release..., check if host has to be github or 'https://update.electronjs.org' service
	},
	updateInterval: '5 minutes',
	notifyUser: false
})

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

// store user data
const store: Store = new Store({
	userDataPath: app.getPath('userData'),
	configName: 'config'
});
// remote window – ssg options
const remoteWindow = ipcMain;
// ssg
let ssg: ScreenSaverGallery | null = null;
const ssgWindows: BrowserWindow[] = [];
// devMode
let devMode = store.devMode;
const sensitive = store.sensitive;
const muted = store.muted;
const voiceOver = store.voiceOver;
if (!store.id) store.id = uuidv4(); // set id for navigator if not set

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	app.quit();
});

app.on("ready", () => {
	console.log('argv', process.argv); 
	console.log('app.isPacked?', app.isPackaged);
	

	remoteWindow.on('message', (event: any, data: any) => {
		console.log('data', data);
		if (data.devMode) store.devMode = data.value;
		if (data.sensitive) store.sensitive = data.value;
		if (data.muted) store.muted = data.value;
		if (data.closed) app.quit();
	});
	
	const argNum = 1; // in production it is 1, for dev set 2
	const devArgNum = 2;
	console.log('process.argv', process.argv);
	// console.log('CONFIG_WINDOW_PRELOAD_WEBPACK_ENTRY', CONFIG_WINDOW_PRELOAD_WEBPACK_ENTRY);
	// console.log('CONFIG_WINDOW_WEBPACK_ENTRY', CONFIG_WINDOW_WEBPACK_ENTRY);
	if(process.argv.length > 1) {
		/* OPTIONS DIALOG (MODAL) */
		if ( 
			(process.argv[argNum] === "/C" || process.argv[argNum].match(/^\/c/)) ||
			process.argv[devArgNum] && (process.argv[devArgNum] === "/C" || process.argv[devArgNum].match(/^\/c/))
		) { // configuration
			showConfigModal();
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
			ssg = null;
			const execPath = path.resolve(process.execPath);
			registerScreenSaver(execPath, true);
			ssg = new ScreenSaverGallery(false, devMode, store);
			ssg.init();
			// ssgWindows.push(...ssg.windows);
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

function showConfigModal(): void {
	const modal = new BrowserWindow({
		width: store.devMode ? 1400 : 700, 
		height: 400, 
		webPreferences: {
			sandbox: false,
			nodeIntegration: true,
			preload: CONFIG_WINDOW_PRELOAD_WEBPACK_ENTRY, // `${__dirname}/assets/modal/modal.js`,
			contextIsolation: true,
			devTools: store.devMode
		},
		show: false,
		frame: false,
		roundedCorners: true
	});
	modal.setIcon(`${__dirname}/assets/ssg-icon.ico`);
	// no window menu
	modal.setMenu(null);
	remote.enable(modal.webContents);
	const queryParams = `devMode=${devMode}&muted=${muted}&sensitive=${sensitive}&voiceOver=${voiceOver}&version=${urlEncodedAppVersion()}`
	modal.loadURL(`${CONFIG_WINDOW_WEBPACK_ENTRY}?${queryParams}`);
	if (store.devMode) modal.webContents.openDevTools();
	// modal.webContents.openDevTools(); // temp

	modal.once('ready-to-show', () => {
		modal.show();
	});

	modal.on('close', () => {
		app.quit();
	});

	return;
}

function urlEncodedAppVersion(): string {
	const version = encodeURIComponent(`${app.getVersion()} (${process.env.BUILD})`);
	console.log('urlEncodedAppVersion', version);
	return version;
}

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
