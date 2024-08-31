import { BrowserWindow, app, screen } from 'electron';
// import { SSG_URL, SSG_URL_DEV, BUILD } from './env';
// rxjs
import { Subject } from 'rxjs';

const mainURL = process.env.SSG_URL;
const devURL = process.env.SSG_URL_DEV;
const localURL = "file://" + __dirname + "/assets/local/default.html";


export class ScreenSaverGallery {
    private isPreview = false;
	private devMode = false;
	private store: any;
	windows: BrowserWindow[] = [];
	onClose: Subject<boolean> = new Subject();

	constructor(isPreview: boolean, devMode: boolean, store: any) {
        this.isPreview = isPreview;
		this.devMode = devMode;
		this.store = store;
    }
    
    init() {
		if (this.isPreview) {
			return;
		}
		// screens
		let screens = screen.getAllDisplays();
		// console.log("screens", screens);

		for (const s of screens) {
			// console.log('screen', s);
			const w = this.createSSGWindow(s.bounds.x, s.bounds.y, s.bounds.width, s.bounds.height, this.devMode);
			this.windows.push(w);
		}
    }

	destroy(): void {
		for (const w of this.windows) {
			w.destroy();
		}
		this.windows.length = 0;
	} 

	private createSSGWindow(x: number, y: number, width: number, height: number, dev: boolean = false) {
		let window = new BrowserWindow({
			x: x,
			y: y,
			width: width,
			height: height,
			show: false,
			autoHideMenuBar: true,
			fullscreen: true,
			frame: false, // (this.isPreview ? false : true),
			transparent: true,
			webPreferences: {
				nodeIntegration: true, // <- 
				autoplayPolicy: 'no-user-gesture-required',
				devTools: dev ? true : false
			}
		});
		// open dev tools for dev mode
		if (dev) window.webContents.openDevTools();
		// set always on top
		window.setAlwaysOnTop(true);
		// set user agent
		window.webContents.setUserAgent(window.webContents.getUserAgent() + ` SSG/${app.getVersion()} (${process.env.BUILD})`);
		// hide the cursor
		window.webContents.on('dom-ready', (event: any) => {
            let css = '* { cursor: none !important; pointer-events: none; }';
            window.webContents.insertCSS(css);
			// append script
			this.setScreenSaverEvents(window, dev);
        });
		// no menu
		window.setMenu(null);
		// load url
		window.loadURL(dev ? devURL : mainURL);
		window.webContents.on('did-fail-load', (e, error, errorDescription) => {
		    window.loadURL(localURL);
	    });
		window.once('ready-to-show', () => {
	    	window.show();
	    });
		
		// deinit
        window.on("closed", () => { 
			this.destroy();
			this.onClose.next(true);
			window = null;
		});

		return window;
	}

    // set the proper screen saver specific events (mousemove, click, keydown -> quit)
    private setScreenSaverEvents(window: BrowserWindow, dev: boolean) {
		// var code = `window.navigator['uuid'] = ${this.id}`;
		const contents = window.webContents;
		var code = '';
		code += `navigator.id = "${this.store.id}";`;
		code += `navigator.muted = ${this.store.muted};`;
		code += `navigator.sensitive = ${this.store.sensitive};`;
		code += `navigator.voiceOver = ${this.store.voiceOver};`;
		if (!dev) {
			// exit if mousemove, keydown, click
			code += 'document.addEventListener("mousemove", () => { window.close(); });';
			code += 'document.addEventListener("keydown", () => { window.close(); });';
			code += 'document.addEventListener("click", () => { window.close(); });';
			code += 'document.body.style.cursor = "none";';
		} else {
			code += 'document.addEventListener("keydown", (e) => { if (e.keyCode == 27) { window.close(); } });';
		}
		code = `(() => {${code}})();`; // run after document completely loaded
		contents.executeJavaScript(code);
	}
}