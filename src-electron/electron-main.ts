import { app, BrowserWindow, ipcMain, Notification, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import path from 'path';
import os from 'os';

log.transports.file.level = 'info';
autoUpdater.logger = log;
autoUpdater.autoDownload = true;

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
            preload: path.resolve(
                __dirname,
                process.env.QUASAR_ELECTRON_PRELOAD
            ),
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
        mainWindow?.webContents.send(
            'updater-message',
            '업데이트를 확인 중입니다...'
        );
    });

    autoUpdater.on('update-available', () => {
        log.info('Update available.');
        mainWindow?.webContents.send(
            'updater-message',
            '업데이트가 발견되었습니다. 다운로드 중...'
        );
    });

    autoUpdater.on('update-not-available', () => {
        log.info('Update not available.');
    });

    autoUpdater.on('update-downloaded', (event) => {
        log.info('Update downloaded:', event);
        mainWindow?.webContents.send(
            'updater-message',
            '업데이트가 다운로드되었습니다. 설치를 시작합니다.'
        );
    });

    ipcMain.on('install-update', () => {
        autoUpdater.quitAndInstall();
    });

    ipcMain.on('chat-message', (event, data) => {
        console.log('chat-message');
        new Notification({
            title: data.auhtor,
            body: data.message,
        }).show();
    });

    ipcMain.on('open-external', (event, data) => {
        console.log('open-external');
        shell.openExternal(data);
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
