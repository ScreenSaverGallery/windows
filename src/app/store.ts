// import { app } from 'electron';
// import * as remote from '@electron/remote';
import * as path from 'path';
import * as fs from 'fs';

export class Store {
    private configPath: string;
    private data: any;

    constructor(options: any) {
        // const app = options.app;
        // console.log('app', app);
        const userDataPath = options.userDataPath; // (app/*  || remote.app */).getPath('userData');
        // console.log('userDataPath', userDataPath);
        this.configPath = path.join(userDataPath, options.configName + '.json');
        console.log('configPath', this.configPath);
        this.data = this.parseDataFile(this.configPath, options.defaults);
    }

    get getDevMode(): boolean {
        return this.data.devMode;
    }

    get getId(): string {
        return this.data.id;
    }

    get getSensitive(): boolean {
        return this.data.sensitive;
    }

    get getMuted(): boolean {
        return this.data.muted;
    }

    get getVoiceOver(): boolean {
        return this.data.voiceOver;
    }

    set setDevMode(value: boolean) {
        console.log('setDevMode', value);
        this.data.devMode = value;
        this.writeData();
        // fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    set setId(value: string) {
        this.data.id = value;
        this.writeData();
        // fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    set setSensitive(value: boolean) {
        this.data.sensitive = value;
        this.writeData();
        // fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    set setMuted(value: boolean) {
        this.data.muted = value;
        this.writeData();
    }

    set voiceOver(value: boolean) {
        this.data.voiceOver = value;
        this.writeData();
    }

    private writeData() {
        fs.writeFileSync(this.configPath, JSON.stringify(this.data));
    }

    private parseDataFile(filePath: string, defaults: any) {
        try {
            const file = fs.readFileSync(filePath);
            return JSON.parse(file.toString());
        } catch (error) {
            console.error('Cannot read config file :/');
            return defaults;
        }
    }

}