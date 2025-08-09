const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true,
            allowRunningInsecureContent: false,
            experimentalFeatures: false
        },
        icon: path.join(__dirname, 'assets', 'icon.png'), // Add icon later
        show: false, // Don't show until ready-to-show
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
        backgroundColor: '#0f0f23', // Match app background
        title: 'EQPad - Equestria\'s Premier Story Platform'
    });

    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        // Open DevTools in development
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile('index.html');
    }

    // Show window when ready to prevent visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        // Focus on the window
        if (isDev) {
            mainWindow.focus();
        }
    });

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Prevent new window creation
    mainWindow.webContents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        shell.openExternal(navigationUrl);
    });

    // Handle certificate errors
    mainWindow.webContents.on('certificate-error', (event, url, error, certificate, callback) => {
        if (isDev) {
            // In development, ignore certificate errors
            event.preventDefault();
            callback(true);
        } else {
            // In production, use default behavior
            callback(false);
        }
    });

    // Create application menu
    createMenu();
}

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Story',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.webContents.send('menu-new-story');
                    }
                },
                {
                    label: 'Open Library',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        mainWindow.webContents.send('menu-open-library');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Preferences',
                    accelerator: process.platform === 'darwin' ? 'Cmd+,' : 'Ctrl+,',
                    click: () => {
                        mainWindow.webContents.send('menu-preferences');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectall' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Navigate',
            submenu: [
                {
                    label: 'Discover',
                    accelerator: 'CmdOrCtrl+1',
                    click: () => {
                        mainWindow.webContents.send('menu-navigate', 'discover');
                    }
                },
                {
                    label: 'Browse',
                    accelerator: 'CmdOrCtrl+2',
                    click: () => {
                        mainWindow.webContents.send('menu-navigate', 'browse');
                    }
                },
                {
                    label: 'Categories',
                    accelerator: 'CmdOrCtrl+3',
                    click: () => {
                        mainWindow.webContents.send('menu-navigate', 'categories');
                    }
                },
                {
                    label: 'Characters',
                    accelerator: 'CmdOrCtrl+4',
                    click: () => {
                        mainWindow.webContents.send('menu-navigate', 'characters');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Search',
                    accelerator: 'CmdOrCtrl+F',
                    click: () => {
                        mainWindow.webContents.send('menu-search-focus');
                    }
                }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About EQPad',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About EQPad',
                            message: 'EQPad - Equestria\'s Premier Story Platform',
                            detail: 'Version 1.0.0\n\nA desktop application for discovering and reading My Little Pony fan fiction stories.\n\nBuilt with Electron, featuring real-time Equestria Daily integration and Open Library API support.',
                            buttons: ['OK']
                        });
                    }
                },
                {
                    label: 'User Guide',
                    click: () => {
                        shell.openExternal('https://github.com/your-repo/eqpad#readme');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Report Issue',
                    click: () => {
                        shell.openExternal('https://github.com/your-repo/eqpad/issues');
                    }
                },
                {
                    label: 'Check for Updates',
                    click: () => {
                        mainWindow.webContents.send('menu-check-updates');
                    }
                }
            ]
        }
    ];

    // macOS specific menu adjustments
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services', submenu: [] },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        });

        // Window menu
        template[5].submenu = [
            { role: 'close' },
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' }
        ];
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        shell.openExternal(navigationUrl);
    });
});

// Handle app certificate errors
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    if (isDev) {
        // In development, ignore certificate errors for localhost
        if (url.startsWith('https://localhost') || url.startsWith('https://127.0.0.1')) {
            event.preventDefault();
            callback(true);
            return;
        }
    }
    
    // Use default behavior for other URLs
    callback(false);
});

// IPC handlers for renderer process communication
ipcMain.handle('app-version', () => {
    return app.getVersion();
});

ipcMain.handle('app-platform', () => {
    return process.platform;
});

// Handle app updates (placeholder for future implementation)
ipcMain.handle('check-for-updates', async () => {
    // This would integrate with electron-updater in a real app
    return {
        updateAvailable: false,
        currentVersion: app.getVersion()
    };
});

// Export for testing
module.exports = { createWindow };
