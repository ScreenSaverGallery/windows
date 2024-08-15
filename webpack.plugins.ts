import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import * as path from 'path';
import DotenvWebpackPlugin from 'dotenv-webpack';
import { WebpackPluginInstance, DefinePlugin } from 'webpack';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'src/assets'), 
        to: path.resolve(__dirname, '.webpack/main/assets')
      },
      {
        from: path.resolve(__dirname, 'src/app/modal/ssg-icon-color.svg'),
        to: path.resolve(__dirname, '.webpack/renderer/config_window/')
      }
    ]
  }),
  new DotenvWebpackPlugin() as unknown as WebpackPluginInstance,
  // see: https://stackoverflow.com/a/63411811
  new DefinePlugin({
    'process.env': {
      SSG_URL: JSON.stringify(process.env.SSG_URL),
      SSG_URL_DEV: JSON.stringify(process.env.SSG_URL_DEV),
      BUILD: JSON.stringify(process.env.BUILD)
    }
  })
];
