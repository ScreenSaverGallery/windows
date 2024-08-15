import MakerBase, { MakerOptions } from '@electron-forge/maker-base';
import { buildForge } from 'app-builder-lib';

export default class MakerNSIS extends MakerBase<any> {
    name = 'nsis';

    defaultPlatforms: string[] = ['win32', 'x64'];

    isSupportedOnCurrentPlatform(): boolean {
        return process.platform === 'win32';
    }

    async make(options: MakerOptions): Promise<string[]> {
        return buildForge(options, { win: [`nsis:${options.targetArch}`] });
    }
}