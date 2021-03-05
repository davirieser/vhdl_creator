
var {app, BrowserWindow, screen} = require('electron');

let win = null;

app.on('ready', () => {

    win = new BrowserWindow({
        // darkTheme: true,
        // useContentSize: false,
        // fullscreen: true,
        // frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.setBounds(
        {
            x: 0,
            y: 0,
            height: screen.getPrimaryDisplay().workAreaSize.height,
            width: screen.getPrimaryDisplay().workAreaSize.width
        }
    );

    win.loadFile('src/index.html');

})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
