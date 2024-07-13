# ScreenSaverGallery
Welcome to the ScreenSaverGallery project! This repository contains the code for a unique screensaver (ScreenSaverGallery), transforming your screen into a gallery of digital and online art. 

## About
ScreenSaverGallery is an innovative project that merges the worlds of digital art and screen savers. Our aim is to breathe new life into the screensaver medium by turning it into a dynamic canvas for contemporary art. The screensaver showcases artworks that either act as screen savers or thematize virtual space, networking, and digital interaction. It is not just a platform for presenting art but also an experimental environment for its development.

Artworks in the ScreenSaverGallery are curated to add a new dimension by placing them in the context of a screensaver. Curators, artists, researchers and developers are invited to explore and experiment with the possibilities offered by this medium.

## Installation
### For Developers: 
1. Clone the repository: ```git clone https://github.com/ScreenSaverGallery/windows.git```
> **Note**: This repository contains two branches. The `main`, which is the base for the whole project, and `admin-setup`, which contains additional setup for the [`nsis`](nsis) installer. By default, ScreenSaverGallery is installed by (and for) a specific user only and does not require administrator privileges. In some cases (e.g. public computers - libraries, universities, companies, ...) ScreenSaverGallery can be installed by the computer administrators to be available to every user of the computer. And this is the case where the `admin-setup' branch comes into play.
2. Open the project in your favorite IDE (eg. VS Code).
3. From the terminal (PowerShell is recomended) run the following: 
- **start** `yarn start`
Start compiled app via electron.exe
- **package** `yarn package`
Pack the app for selected targets (see: [`package.json`](package.json))
- **make** `yarn make`
Create windows nsis installator (see: [`package.json`](package.json))

> **Note**: You must setup your own `src/app/env.ts` file and its respective variables. The file `src/app/env.example.ts` tells you how. These variables (urls) are not yet publicly available as the content is subject to further development. If you want to participate on ScreenSaverGallery project, feel free to contact us to get the active urls. If you want to use this code for your own needs, set up urls of your choice. In that case also do not use the name `ScreenSaverGallery` as is and  replace the ScreenSaverGallery icon with your own.


### For Users:
1. Go to [ScreenSaverGallery](https://screensaver.gallery/get) website
2. Download and install the latest ScreenSaverGallery
3. The ScreenSaverGallery should be set as default during the installation process. If not, open ScreenSaverGallery

## How It Works
The technical implementation of ScreenSaverGallery is straightforward yet effective. The screensaver is essentially an electron app (chromeless browser) which displays curated content from a specified URL. Screen savers on Windows system are regular executable files (exe) with `.scr` extension. The system can run these files with a few special arguments (see: [`src/main.ts`](src/main.ts)) to tell the program show options, preview or a proper screensaver.

## Features
- Display a variety of digital and online artworks as a screensaver.
- Control screensaver's sound by mute or unmute them in the ScreenSaverGallery options by setting browser navigator param `muted=true`. Default: `false`.
- Allow or dissable potentially inappropriate or sensitive content in the ScreenSaverGallery options by setting browser navigator param `sensitive=false`. Default: `false`.
- Support service worker for offline mode.
- Set the ScreenSaverGallery to be more accessible to persons with any kind of visual impairment by setting browser navigator param `voice-over=true`. Default: `false`.

## History
ScreenSaverGallery was first launched by artists Barbora Trnkova and Tomas Javurek in 2012 as an artistic, somewhat ironic, project. In 2013, together with artist and curator c-merry and curator Sakrowski, we launched a continuous exhibition program that continues to this day. You can see the list of screensavers [here](https://screensaver.gallery/archive/screensavers). 

## Contributing

We welcome contributions from developers, artists, and enthusiasts! Here’s how you can get involved:

### Reporting Issues
If you encounter any bugs or have suggestions for improvements, please open an issue on GitHub.

### Submitting Pull Requests
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear, concise messages.
4. Push your changes to your forked repository.
5. Submit a pull request detailing your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.