import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import path from 'path';
import os from 'os';

log.transports.file.level = 'info';
autoUpdater.logger = log;

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('error', (error: Error) => {
    log.error('Error in auto-updater:', error);
    mainWindow?.webContents.send('updater-message', 'Got Error');
  });

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for updates...');
    mainWindow?.webContents.send('updater-message', 'Checking for Update...');
  });

  autoUpdater.on('update-available', () => {
    log.info('Update available.');
    mainWindow?.webContents.send(
      'updater-message',
      'A new update is available.'
    );
  });

  autoUpdater.on('update-not-available', () => {
    log.info('Update not available.');
    mainWindow?.webContents.send('updater-message', 'Update not available.');
  });

  autoUpdater.on('update-downloaded', (event) => {
    log.info('Update downloaded:', event);
    mainWindow?.webContents.send(
      'updater-message',
      'Update downloaded. Ready to install.'
    );
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});
